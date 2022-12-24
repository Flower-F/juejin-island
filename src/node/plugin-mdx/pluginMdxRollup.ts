import pluginMdx from '@mdx-js/rollup';
import remarkGFM from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMDXFrontmatter from 'remark-mdx-frontmatter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';

export function pluginMdxRollup() {
  return [
    pluginMdx({
      remarkPlugins: [
        remarkGFM,
        remarkFrontmatter,
        [
          remarkMDXFrontmatter,
          {
            name: 'frontmatter',
          },
        ],
      ],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              class: 'header-anchor',
            },
            content: {
              type: 'text',
              value: '#',
            },
          },
        ],
      ],
    }),
  ];
}
