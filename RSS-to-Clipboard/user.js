javascript: (function () {
  let rsshub_host = 'https://rsshub.app';
  let lilydjwg_host = 'https://rss.lilydjwg.me';

  let cnblog = 'https://www.cnblogs.com/';
  let csdn = 'https://blog.csdn.net/';
  let feed43 = 'https://feed43.com';
  let jianshu_user = '/jianshu/user/';
  let zhihu_user = '/zhihu/people/activities/';
  let zhihu_zhuanlan = '/zhihu/zhuanlan/';
  let zhihu_collection = '/zhihu/collection/';
  let bilibili_user = '/bilibili/user/video/';
  let jike_topic = '/jike/topic/';
  let jike_square = '/jike/topic/square/';
  let jike_user = '/jike/user/';
  let twitter_user = '/twitter/user/';
  let weibo_user = '/weibo/user/';
  let instagram_user = '/instagram/user/';
  let youtube_channel = '/youtube/channel/';
  let github_issues = '/github/issue/';

  let feedurl = '';
  let domain = location.host;
  let path = location.pathname.split('/');
  let urlparam = new URLSearchParams(location.href);

  if (domain == 'www.cnblogs.com') {
    feedurl = cnblog + path[1] + '/rss';
  } else if (domain == 'blog.csdn.net') {
    feedurl = csdn + path[1] + '/rss/list';
  } else if (domain == 'feed43.com') {
    if (path[1].length - path[1].indexOf('.xml') == 4) {
      feedurl = location.href;
    } else if (path[1] == 'feed.html') {
      if (urlparam.has('name')) {
        feedurl = feed43 + '/' + urlparam.get('name') + '.xml';
      } else {
        alert('Use it in Feed43 feed edit Page');
      }
    } else {
      alert('Use it in Feed43 feed edit Page');
    }
  } else if (domain == 'zhuanlan.zhihu.com') {
    if (path[1] == 'p') {
      alert('Use it in ZhihuZhuanlan home page');
    } else {
      feedurl = lilydjwg_host + '/zhihuzhuanlan/' + path[1];
    }
  } else if (domain == 'www.zhihu.com') {
    if (path[1] == 'people' || path[1] == 'org') {
      feedurl = lilydjwg_host + '/zhihu/' + path[2];
    } else {
      alert('Use it in Zhihu user page');
      return;
    }
  }
  if (feedurl != '') {
    console.log('RSS found in Website');
  } else {
    console.log('RSS not found in Website');
    console.log('Trying RSSHub ... ');
    let rsshub_path = '';
    if (domain == 'www.jianshu.com') {
      if (path[1] == 'u') {
        rsshub_path = jianshu_user + path[2];
      } else {
        alert('Use it in Jianshu user page');
        return;
      }
    } else if (domain == 'www.zhihu.com') {
      if (path[1] == 'people' || path[1] == 'org') {
        rsshub_path = zhihu_user + path[2];
      } else if (path[1] == 'collection') {
        rsshub_path = zhihu_collection + path[2];
      } else {
        alert('Use it in Zhihu user page');
        return;
      }
    } else if (domain == 'zhuanlan.zhihu.com') {
      if (path[1] == 'p') {
        alert('Use it in ZhihuZhuanlan home page');
        return;
      } else {
        rsshub_path = zhihu_zhuanlan + path[1];
      }
    } else if (domain == 'space.bilibili.com') {
      rsshub_path = bilibili_user + path[1];
    } else if (domain == 'web.okjike.com') {
      if (path[1] == 'topic') {
        if (path[3] == 'official') {
          rsshub_path = jike_topic + path[2];
        } else if (path[3] == 'user') {
          rsshub_path = jike_square + path[2];
        }
      } else if (path[1] == 'user') {
        rsshub_path = jike_user + path[2];
      } else {
        alert('Use it in Jike user or topic page');
        return;
      }
    } else if (domain == 'twitter.com') {
      rsshub_path = twitter_user + path[1];
    } else if (domain == 'm.weibo.cn') {
      if (path[1] == 'profile') {
        rsshub_path = weibo_user + path[2];
      } else {
        alert('Use it in Weibo user home page');
        return;
      }
    } else if (domain == 'weibo.com' || domain == 'www.weibo.com') {
      rsshub_path = weibo_user + $CONFIG.oid;
    } else if (domain == 'www.instagram.com') {
      if (path[1] == 'p') {
        alert('Use it in Instagram user home page');
        return;
      } else {
        rsshub_path = instagram_user + path[1];
      }
    } else if (domain == 'www.youtube.com') {
      if (path[1] == 'channel') {
        rsshub_path = youtube_channel + path[2];
      } else {
        alert('Use it in YouTube channel page');
        return;
      }
    } else if (domain == 'github.com') {
      if (path[3] == 'issues'){
        rsshub_path = github_issues + path[1] + '/' + path[2];
      } else {
        alert('Use it in GitHub Issues page');
        return;
      }
    }
    if (rsshub_path == '') {
      console.log('Rss not found, if rsshub supports this website, please contact me');
      console.log('https://tmr.js.org/');
      alert('Rss not found, if rsshub supports this website, please contact me');
      return;
    } else {
      console.log('RSS found in RSSHub');
      feedurl = rsshub_host + rsshub_path;
    }
  }
  if (feedurl) {
    console.log(feedurl);
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', feedurl);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      console.log('Copy to clipboard');
      alert('RSS copied to clipboard');
    }
    document.body.removeChild(input);
  }
})();