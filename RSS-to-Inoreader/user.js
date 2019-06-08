javascript: (function () {
  let rsshub_host = 'https://rsshub.app';

  let cnblog = 'https://www.cnblogs.com/';
  let csdn = 'https://blog.csdn.net/';
  let jianshu_user = '/jianshu/user/';
  let zhihu_user = '/zhihu/people/activities/';
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

  let w = 800;
  let h = 600;
  let feedurl = '';
  let domain = location.host;
  let path = location.pathname.split('/');

  if (domain == 'www.cnblogs.com') {
    feedurl = cnblog + path[1] + '/rss';
  } else if (domain == 'blog.csdn.net') {
    feedurl = csdn + path[1] + '/rss/list';
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
      if (path[3] == 'issues') {
        rsshub_path = github_issues + path[1] + '/' + path[2];
      } else {
        alert('Use it in GitHub Issues page');
        return;
      }
    }
    if (rsshub_path == '') {
      console.log('RSS not found');
    } else {
      console.log('RSS found in RSSHub');
      feedurl = rsshub_host + rsshub_path;
    }
  }
  if (feedurl) {
    console.log(feedurl);
    feedurl = 'https://www.inoreader.com/?add_feed=' + feedurl;
  } else {
    feedurl = 'https://www.inoreader.com/bookmarklet/subscribe/' + encodeURIComponent(location.href);
  }
  console.log(feedurl);
  let b = window.screenLeft != undefined ? window.screenLeft : screen.left;
  let c = window.screenTop != undefined ? window.screenTop : screen.top;
  let width = window.innerWidth ?
    window.innerWidth :
    document.documentElement.clientWidth ?
      document.documentElement.clientWidth :
      screen.width;
  let height = window.innerHeight ?
    window.innerHeight :
    document.documentElement.clientHeight ?
      document.documentElement.clientHeight :
      screen.height;
  let d = width / 2 - w / 2 + b;
  let e = height / 2 - h / 2 + c;
  let f = window.open(
    feedurl,
    new Date().getTime(),
    'width=' +
    w +
    ', height=' +
    h +
    ', top=' +
    e +
    ', left=' +
    d +
    'location=yes,resizable=yes,status=no,scrollbars=no,personalbar=no,toolbar=no,menubar=no'
  );
  if (window.focus) {
    f.focus();
  }
})();