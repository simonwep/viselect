import {defineConfig} from 'vitepress';
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export default defineConfig({
    title: 'Viselect',
    base: '/viselect/',
    description: 'Viselect - A high performance and lightweight library to add a visual way of selecting elements, just like on your Desktop. Zero dependencies.',
    head: [

        // SEO
        ['meta', {name: 'keywords', content: 'viselect, select, selectbox, selectize, selectize, typescript, simonwep'}],
        ['meta', {name: 'description', content: 'Viselect - A high performance and lightweight library to add a visual way of selecting elements, just like on your Desktop. Zero dependencies.'}],
        ['meta', {name: 'subject', content: 'Software development'}],
        ['meta', {name: 'topic', content: 'Software development'}],
        ['meta', {name: 'summary', content: 'Viselect - A high performance and lightweight library to add a visual way of selecting elements, just like on your Desktop. Zero dependencies.'}],
        ['meta', {name: 'copyright', content: 'Simon Reinisch'}],
        ['meta', {name: 'owner', content: 'Simon Reinisch'}],
        ['meta', {name: 'author', content: 'Simon Reinisch'}],
        ['meta', {name: 'robots', content: 'index, follow'}],
        ['meta', {name: 'url', content: 'https://simonwep.github.io/viselect'}],
        ['meta', {name: 'revisit-after', content: '7 days'}],

        // Open Graph
        ['meta', {property: 'og:url', content: 'https://simonwep.github.io/viselect'}],
        ['meta', {property: 'og:type', content: 'website'}],
        ['meta', {property: 'og:site_name', content: 'Viselect'}],
        ['meta', {property: 'og:title', content: 'Viselect'}],
        ['meta', {property: 'og:image', content: 'https://simonwep.github.io/viselect/cover.png'}],
        ['meta', {property: 'og:image:type', content: 'image/png'}],
        ['meta', {property: 'og:image:height', content: '1080'}],
        ['meta', {property: 'og:image:width', content: '1920'}],
        ['meta', {property: 'og:image:alt', content: 'The cover of Viselect featuring the name and a subheader on a solid white background.'}],
        ['meta', {property: 'og:description', content: 'Viselect - A high performance and lightweight library to add a visual way of selecting elements, just like on your Desktop. Zero dependencies.'}],

        // Analytics
        ['script', {defer: true, src: 'https://numai.reinisch.io/script.js', 'data-website-id': 'f2c623d2-5353-4dc5-acc5-d6979536958a'}],

        // Icons
        ['link', {rel: 'icon', href: '/viselect/favicon.ico', sizes: '32x32'}],
        ['link', {rel: 'icon', href: '/viselect/favicon.svg', sizes: 'any', type: 'image/svg+xml'}],
        ['link', {rel: 'apple-touch-icon', href: '/viselect/apple-touch-icon.png'}],
    ],
    themeConfig: {
        nav: [
            {text: 'Home', link: '/'},
            {text: 'FAQ', link: '/pages/faq'},
            {text: 'API Reference', link: 'pages/api-reference'},
        ],
        sidebar: [
            {
                text: 'Introduction',
                items: [
                    {text: 'Quickstart', link: 'pages/quickstart'},
                    {text: 'Examples', link: 'pages/examples'},
                    {text: 'API Reference', link: 'pages/api-reference'},
                    {text: 'Custom Integration', link: 'pages/custom-integration'},
                    {text: 'FAQ', link: 'pages/faq'},
                ]
            },
            {
                text: 'Frameworks',
                items: [
                    {text: 'Vanilla', link: 'pages/frameworks/vanilla'},
                    {text: 'React', link: 'pages/frameworks/react'},
                    {text: 'Preact', link: 'pages/frameworks/preact'},
                    {text: 'Vue', link: 'pages/frameworks/vue'}
                ]
            }
        ],
        socialLinks: [
            {icon: 'github', link: 'https://github.com/simonwep/viselect'}
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2018-present Simon Reinisch'
        }
    },
    vite: {
        resolve: {
            alias: {
                '@viselect/vanilla': require.resolve('../../packages/vanilla/dist/viselect.mjs')
            }
        }
    }
});
