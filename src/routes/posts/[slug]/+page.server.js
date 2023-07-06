import { getPostBySlug } from '$lib/api';
import { redirect, fail } from '@sveltejs/kit';

export async function load({ params, locals, url }) {
  const secret = url.searchParams.get('secret');
  const data = await getPostBySlug(params.slug, secret, locals.currentUser);
  if (data.slug !== params.slug) {
    throw redirect(301, `/posts/${data.slug}`);
  } else {
    return {
      ...data
    };
  }
}
