// ==MiruExtension==
// @name         WerzMiruMurrtube
// @version      v0.0.1
// @author       WerewolfwolfyXD
// @lang         zh-cn
// @license      MIT
// @package      werzmurrtube
// @type         bangumi
// @icon         https://murrtube.net/assets/logo256-6a4085b80162b1d5e76141213fea3a4e9fd6fee07f7f37fa37cfc2adfce1c33c.png
// webSite      http://192.168.0.103:4567
// @webSite      https://werzmirubackstmurrtube-werewolfwolfyxds-projects.vercel.app/
// @nsfw         true
// ==/MiruExtension==

export default class extends Extension {
    async latest(page) {
      const res = await this.request(`/murrtube_parser/page/latest?page=${page}`);
      var novel = [];
      const cards = await this.querySelectorAll(res, 'div[class="card"]');
      for (const element of cards) {
        const v_title = await this.querySelector(element.content, 'p[class="is-6 is-truncated-text has-text-lighter has-text-weight-bold"]').text;
        const v_url = await this.getAttributeText(element.content, 'a', 'href');
        const v_cover = await this.getAttributeText(element.content, 'img[class="video-image"]', "src");
        
        const package_url = `${v_url}|${v_cover}`;

        const manualData = [
          String(v_title),
          String(package_url),
          String(v_cover)
        ];
        novel.push({
          title: manualData[0],
          url: manualData[1],
          cover: manualData[2],
          })
      }
      return novel
    }
    async search(kw, page, filter) {
        // 搜索
        const res = await this.request(`/murrtube_parser/page/search?q=${kw}&page=${page}`);
        const novel = [];


        const cards = await this.querySelectorAll(res, 'div[class="card"]');
        for (const element of cards) {
          const v_title = await this.querySelector(element.content, 'p[class="is-6 is-truncated-text has-text-lighter has-text-weight-bold"]').text;
          const v_url = await this.getAttributeText(element.content, 'a', 'href');
          const v_cover = await this.getAttributeText(element.content, 'img[class="video-image"]', "src");
          
          const package_url = `${v_url}|${v_cover}`;

          const manualData = [
            String(v_title),
            String(package_url),
            String(v_cover)
          ];
          novel.push({
            title: manualData[0],
            url: manualData[1],
            cover: manualData[2],
            })
        }
      
        return novel;
      }


    async detail(url) {
      const rp = url.split("|");
      const rurl = rp[0];
      const rthumbnail = rp[1];

      const res = await this.request(`/murrtube_parser/page/${rurl}`)

      const v_desc = await this.querySelector(res, 'meta[name="keywords"]').getAttributeText("content");
      const v_keyw = await this.querySelector(res, 'meta[name="description"]').getAttributeText("content");
      const v_title = await this.querySelector(res, 'meta[property="og:title"]').getAttributeText("content");
      const v_thumbnail = rthumbnail;
      const v_packaged_desc = `${v_keyw}\n\nTAGS: ${v_desc}`
      const v_urls = await this.getAttributeText(res, 'video[id="video"]','data-url');
      const v_lendex = v_urls.match(/https:\/\/storage\.murrtube\.net\/murrtube-production\/[^\/]+?\/[^\/]+?\//);
      const v_eps = [];
      
      const lst = String(await this.request(`/murrtube_parser/m3u8procv/?a=${v_urls}`)).split("|");

      for (const e of lst) {
        var vurls = [];
        const req = await this.request(`/murrtube_parser/m3u8procd/?a=${v_lendex}${e}`);
        const rereq = String(req).split("|");
        
        for (const i of rereq) {
          vurls.push({
            name: String(i),
            url: `${v_lendex}${i}`,
          })
        }

        v_eps.push({
          title: e,
          urls: vurls,
        });
      }

      const result = {
        title: v_title, // 确保标题没有前后空格
        cover: v_thumbnail,
        desc: String(v_packaged_desc).trim(),
        // desc: String(v_packaged_desc).trim(),
        episodes: v_eps,
      };
      return result
    }
    async watch(url) {
      return {
        type: "hls",
        url: url,
      };
    }
}
