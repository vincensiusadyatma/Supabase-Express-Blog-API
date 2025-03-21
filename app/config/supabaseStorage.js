import supabase from './supabaseClient.js';

async function makeBucketPublic(bucketName) {
    const { data, error } = await supabase.storage.updateBucket(bucketName, {
        public: true,
    });

    if (error) {
        console.error("Error updating bucket:", error);
    } else {
        console.log(`Bucket "${bucketName}" is now public!`, data);
    }
}


makeBucketPublic('Srijaya-International-Image');
