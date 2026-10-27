import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    avatar_url: string | null;
    gender: 'male' | 'female' | 'other' | null;
    date_of_birth: string | null;
    height_cm: number | null;
    current_weight_kg: number | null;
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
    goal: 'lose_weight' | 'gain_muscle' | 'maintain' | null;
    workout_days?: number[] | null;
    workout_period?: 'morning' | 'noon' | 'evening' | null;
    workout_start_time?: string | null;
    workout_duration_min?: number | null;
    health_condition?: 'none' | 'diabetes' | 'hypertension' | 'heart' | 'joints' | 'other' | null;
    health_notes?: string | null;
    created_at: string;
    updated_at: string;
}

export function getAvatarUploadErrorMessage(error: unknown): string {
    const message =
        error && typeof error === 'object' && 'message' in error
            ? String((error as { message: string }).message)
            : ''

    if (message.includes('Bucket not found')) {
        return (
            'Chưa có bucket Storage "profiles" trên Supabase. ' +
            'Vào SQL Editor, chạy create_profiles_storage_bucket.sql và storage_policies.sql ' +
            '(xem supabase/HUONG_DAN_SETUP.md mục 5).'
        )
    }

    return message || 'Không thể tải ảnh lên'
}

export function isProfileSetupComplete(profile: Profile | null): boolean {
    if (!profile) return false
    return Boolean(
        profile.activity_level &&
        profile.height_cm &&
        profile.gender &&
        profile.goal,
    )
}

export const ProfileService = {
    /**
     * Get user profile by user ID
     */
    async getProfile(userId: string): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching profile:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Exception fetching profile:', error);
            return null;
        }
    },

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                console.error('Error updating profile:', error);
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Exception updating profile:', error);
            throw error;
        }
    },

    /**
     * Pick an image from the device gallery
     */
    async pickImage(): Promise<ImagePicker.ImagePickerAsset | null> {
        try {
            console.log('🖼️ Starting pickImage...');
            
            // Check and request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log('📸 Permission result:', permissionResult);
            
            if (permissionResult.status !== 'granted') {
                console.log('❌ Permission denied');
                throw new Error('Bạn cần cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.\n\nVào Cài đặt > Quyền để bật quyền truy cập ảnh.');
            }

            console.log('✅ Permission granted, launching picker...');
            
            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            console.log('📷 Picker result:', result);

            if (result.canceled) {
                console.log('User canceled picker');
                return null;
            }

            if (!result.assets || result.assets.length === 0) {
                console.log('No assets selected');
                return null;
            }

            console.log('✅ Image selected:', result.assets[0].uri);
            return result.assets[0];
        } catch (error: any) {
            console.error('❌ Error in pickImage:', error);
            console.error('Error stack:', error?.stack);
            throw error;
        }
    },

    /**
     * Upload avatar to Supabase Storage
     */
    async uploadAvatar(userId: string, imageUri: string): Promise<string> {
        try {
            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(imageUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Generate unique filename
            const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${userId}_${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Convert base64 to ArrayBuffer
            const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;

            // Upload to Supabase Storage
            const { error } = await supabase.storage
                .from('profiles')
                .upload(filePath, arrayBuffer, {
                    contentType: `image/${fileExt}`,
                    upsert: true,
                });

            if (error) {
                console.error('Error uploading avatar:', error);
                throw new Error(getAvatarUploadErrorMessage(error));
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (error) {
            console.error('Exception uploading avatar:', error);
            throw error instanceof Error && error.message.includes('bucket Storage')
                ? error
                : new Error(getAvatarUploadErrorMessage(error));
        }
    },

    /**
     * Update user avatar (pick and upload)
     */
    async updateAvatar(userId: string): Promise<string | null> {
        try {
            // Pick image
            const image = await this.pickImage();
            if (!image) {
                return null;
            }

            // Upload to storage
            const avatarUrl = await this.uploadAvatar(userId, image.uri);

            // Update profile with new avatar URL
            await this.updateProfile(userId, { avatar_url: avatarUrl });

            return avatarUrl;
        } catch (error) {
            console.error('Error updating avatar:', error);
            throw new Error(getAvatarUploadErrorMessage(error));
        }
    },

    /**
     * Delete old avatar from storage
     */
    async deleteAvatar(avatarUrl: string): Promise<void> {
        try {
            // Extract file path from URL
            const urlParts = avatarUrl.split('/profiles/');
            if (urlParts.length < 2) return;

            const filePath = urlParts[1];

            const { error } = await supabase.storage
                .from('profiles')
                .remove([filePath]);

            if (error) {
                console.error('Error deleting avatar:', error);
                throw error;
            }
        } catch (error) {
            console.error('Exception deleting avatar:', error);
            // Don't throw - deletion failure shouldn't block the upload
        }
    },
};
