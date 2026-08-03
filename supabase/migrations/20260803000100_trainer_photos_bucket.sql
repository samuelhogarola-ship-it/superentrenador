-- Create a public bucket for trainer profile photos.
-- Authenticated users can upload their own photo; anyone can read.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'trainer-photos',
  'trainer-photos',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read (bucket is public)
CREATE POLICY "trainer_photos_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trainer-photos');

-- Authenticated users can upload only to their own folder (user_id/*)
CREATE POLICY "trainer_photos_authenticated_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'trainer-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update/delete only their own files
CREATE POLICY "trainer_photos_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'trainer-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "trainer_photos_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'trainer-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
