import { getSitemap, getRSSFeedData } from '$lib/api';
import { buildRFC822Date, encodeHTMLEntities } from '$lib/util';
import { ORIGIN } from '$env/static/private';


export async function GET({ setHeaders }) {
  setHeaders({
    'Content-Type': 'application/xml'
  });
  const feed = await getRSSFeedData();

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
  <rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:webfeeds="http://webfeeds.org/rss/1.0" version="2.0">
    <channel>
    <title>${feed.name}</title>
    <description>${feed.bio}</description>
    <link>${ORIGIN}</link>
    <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml"/>
    <webfeeds:accentColor>000000</webfeeds:accentColor>
    <webfeeds:icon>${ORIGIN}${feed.avatar || '/images/person-placeholder.jpg'}</webfeeds:icon>
    ${feed.posts
      .map(
        p => `
        <item>
          <title>${p.title}</title>
          <dc:creator>${feed.name}</dc:creator>
          <description>${encodeHTMLEntities(p.content)}</description>
          <pubDate>${buildRFC822Date(p.created_at)}</pubDate>
          <link>${ORIGIN}/posts/${p.slug}</link>
          <guid isPermaLink="true">${ORIGIN}/posts/${p.slug}</guid>
        </item>`
      )
      .join('\n')}
    </channel>
  </rss>`);
}