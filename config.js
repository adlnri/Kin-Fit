/* Kin Fit settings for accounts (Supabase). Both values are public by design: security comes from the
   database rules in supabase/schema.sql. Leave them empty to run the app without accounts.
   Never put the "service_role" / "secret" key or the database password here. */
window.KINFIT_CLOUD = {
  url: 'https://jyyyyllchmrrgdrxegrg.supabase.co',  // Project URL
  key: 'sb_publishable_jnUV-cjPm58Yhz15TAHbNw_6MRo5Hb4',  // publishable key (public by design)
  google: false,    // true once Google sign-in is set up in Supabase › Authentication › Providers
};
