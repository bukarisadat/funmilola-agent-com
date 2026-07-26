CREATE POLICY "Anyone can read property videos"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'property-videos');

CREATE POLICY "Admins can upload property videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'property-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update property videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'property-videos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete property videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'property-videos' AND public.has_role(auth.uid(), 'admin'));