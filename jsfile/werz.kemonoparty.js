// ==MiruExtension==
// @name         Kemono Party
// @version      v0.0.1
// @author       WerewolfwolfyXD
// @lang         zh-cn
// @license      MIT
// @package      werz.kemonoparty
// @type         manga
// @icon         https://kemono.su/static/klogo.png
// @webSite      https://kemono.su
// @nsfw         true
// ==/MiruExtension==

export default class extends Extension {
    async latest(page) {
        const res = await this.request(`/posts/popular?o=${(page-1)*50}`)
        var novel = [];
        const cards = await this.querySelectorAll(res, 'article[class="post-card post-card--preview"]');
        for (const ele of cards) {
            const v_title = String(await this.querySelector(ele.content, 'header[class="post-card__header"]').text).replace("\n", '').trim();
            const v_url = String(await this.getAttributeText(ele.content, 'a', 'href'));
            const v_cover = String(await this.getAttributeText(ele.content, 'img[class="post-card__image"]', 'src')).replace('//', 'https://');
            

            novel.push(
                {
                    title: v_title,
                    url: `${v_url}|${v_cover}`,
                    cover: v_cover,
                }
            )
        }

        return novel
        
    }

    async search(kw, page, filter) {
        const res = await this.request(`/posts?o=${(page-1)*50}&q=${kw}`)
        const novel = [];

        const cards = await this.querySelectorAll(res, 'article[class="post-card post-card--preview"]');
        for (const ele of cards) {
            const v_title = String(await this.querySelector(ele.content, 'header[class="post-card__header"]').text).replace("\n", '').trim();
            const v_url = String(await this.getAttributeText(ele.content, 'a', 'href'));
            const v_cover = String(await this.getAttributeText(ele.content, 'img[class="post-card__image"]', 'src')).replace('//', 'https://');

            novel.push(
                {
                    title: v_title,
                    url: `${v_url}|${v_cover}`,
                    cover: v_cover,
                }
            )
        }

        return novel
    }

    async detail(url) {
        const rspl = url.split("|");
        const rurl = rspl[0];
        const res = await this.request(rurl);
        var r = '';

        const v_title = await this.querySelector(res, 'meta[property="og:title"]').getAttributeText('content');
        var v_desc = '';
        const v_descr = await this.querySelectorAll(res, 'div[class="post__content"]');
        
        for (const f of v_descr) {
            v_desc += String(await this.querySelector(res, 'div[class="post__content"]').text).replace('\n', '') + '\n'

            const v = await this.querySelectorAll(f.content, 'p');
            for (const p of v) {
                v_desc += await this.querySelector(p.content, 'p').text + '\n'
            }
            
        }

        const v_thumbnail = rspl[1];

        var v_eps = [];
        var v_urls = [];

        v_urls.push({
            name: '0',
            url: rurl,
        });

        v_eps.push({
            title: "0", urls: v_urls
        });

        return {
            title: v_title,
            cover: v_thumbnail,
            desc: String(v_desc).trim(),
            episodes: v_eps,
        };
    }

    async watch(url) {
        const res = await this.request(url);
        var index = [];
        const files = await this.querySelectorAll(res, 'div[class="post__thumbnail"]');
        for (const ele of files) {
            index.push(String(await this.getAttributeText(ele.content, 'a', 'href')));
        }

        return {
            urls: index,
        };
    }

}
