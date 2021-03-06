var SITEBASEURL = "http://henmee.dll.in.th/";
//========BROWSER SPECIFIC INIT=========//
var XID = /xid=(\d+)/.exec(document.cookie) || false;
XID = parseInt(XID[1] || 0) ;
if(XID) {
	init_henmee();
	if(/firefox/i.exec(navigator.userAgent)) {
		if(self.options.prefs.topMenu) { mod_topMenu(); }
		if(self.options.prefs.unlockWidth) { mod_unlockWidth(); }
		if(/userhistory.php/.test(document.URL)) {
			if(self.options.prefs.formatUserHistory) { mod_userHistory(); }
		}
		if(/action=viewtopic/.test(document.URL)) {
			if(self.options.prefs.topMenu) { mod_bookmark(); }
			if(self.options.prefs.titleFix) { mod_titleFix(); }
			if(self.options.prefs.revealLinks) { mod_revealLinks(); }
			if(self.options.prefs.hideSignature) { mod_hideSignature(); }
			if(self.options.prefs.autoResizeImageLinks) { mod_autoResizeImageLinks(self.options.prefs.maxAutoResizeWidth || '500'); }
			if(self.options.prefs.quickReply) { mod_quickReply(); }
		}
		if(/browse.php/.test(document.URL)) {
			if(self.options.prefs.cleanBrowse) { mod_cleanBrowse(); }
			if(self.options.prefs.superBrowse) { mod_superBrowse(); }
		}
		if(self.options.prefs.openNewTab) { mod_openNewTab(); }
		if(self.options.prefs.resizePet) { mod_resizePet(); }
	} else if(/chrome/i.exec(navigator.userAgent)) {
		chrome.runtime.sendMessage({action:"getPrefs"}, function(prefs){
			if(prefs.topMenu.value) { mod_topMenu(); }
			if(prefs.unlockWidth.value) { mod_unlockWidth(); }
			if(/userhistory.php/.test(document.URL)) {
				if(prefs.formatUserHistory.value) { mod_userHistory(); }
			}
			if(/action=viewtopic/.test(document.URL)) {
				if(prefs.topMenu.value) { mod_bookmark(); }
				if(prefs.titleFix.value) { mod_titleFix(); }
				if(prefs.revealLinks.value) { mod_revealLinks(); }
				if(prefs.hideSignature.value) { mod_hideSignature(); }
				if(prefs.autoResizeImageLinks.value) { mod_autoResizeImageLinks(prefs.maxAutoResizeWidth.value || '500'); }
				if(prefs.quickReply.value) { mod_quickReply(); }
			}
			if(/browse.php/.test(document.URL)) {
				if(prefs.cleanBrowse.value) { mod_cleanBrowse(); }
				if(prefs.superBrowse.value) { mod_superBrowse(); }
			}
			if(prefs.openNewTab.value) { mod_openNewTab(); }
			if(prefs.resizePet.value) { mod_resizePet(); }
		});
	} else {
		console.log("HenMee Error: Browser not supported.");
	}
}

//================CODE BODY==================//
function updateBookmarks() {
	var oBookmarks = JSON.parse(localStorage['hm_bookmarks']);
	$('#aToBookmarks nav').empty();
	for(k in oBookmarks) {
		var oBookmark = oBookmarks[k];
		$('#aToBookmarks nav').append('<a class="hm_bookmark_item" href="'+oBookmark.url+'" target="_blank" title="'+oBookmark.title+'"><span class="hm_delete_bookmark" title="Delete" tag="'+k+'">'+k+'</span>'+oBookmark.title+'</a>');
	}
	
};

function init_henmee() {
	$(document.body).wrapInner('<div id="body"></div>');

	// hmm tag short cut
	$(document).on('submit', 'form', function(event){
		$('textarea', this).val(function(index, value){
			return value.replace(/\:hmm([0-9]+)\:/gm, "[img]"+SITEBASEURL+"hmm/hmm.php?n=$1[/img]");
		});
	});
};

function mod_topMenu() {
	function appendSubMenu(target, items) {
		$(items).each(function(i,n){
			$(target).append('<a href="'+n.href+'" title="'+n.title+'">'+n.title+'</a>');
		});
	};
	

	$('body').css('padding-top','40px').append('<nav id="topMenu">');
	$('table.mainouter > tbody > tr:first-child a').appendTo('#topMenu');
	$('table.mainouter > tbody > tr:first-child').remove();
	$('#topMenu').append('<a href="logout.php">Logout</a>');
	$('#topMenu a[href*="faq.php"], #topMenu a[href*="topten.php"], #topMenu a[href*="oforums.php"]').remove();
	$('#topMenu a[href*="browse.php"]')
		.addClass('sub')
		.addClass('browse')
		.append('<nav><a href="bookmark.php">Bookmarked torrents</a><a href="userhistory.php?action=viewcomments&id='+XID+'">Torrent comments</a></nav>');
	$('#topMenu a[href*="forums.php"]')
		.addClass('sub')
		.addClass('forums')
		.append('<nav><a href="userhistory.php?action=viewnewposts&id='+XID+'">Forum post history</a><hr></nav>');
	$('#topMenu a.forums').before('<a href="javascript:void(0);" id="aToBookmarks" class="sub">Bookmarks</a>');
	$('#topMenu a[href*="markets.php"]')
		.addClass('sub')
		.addClass('markets')
		.append('<nav><a href="userhistory.php?action=viewmarkets&id='+XID+'">Market post history</a><hr></nav>');
	$('#topMenu a[href*="my.php"]')
		.addClass('sub')
		.addClass('profile')
		.append('<nav><a href="userdetails.php?id='+XID+'">My details</a><a href="inbox.php">Inbox</a><a href="inbox.php?out=1">Sentbox</a></nav>');
		
	if(sessionStorage["forumsMenu"] == undefined) {
		$.get('forums.php', function(response){
			var links = [];
			$('td.embedded > a', response).each(function(i,n){
				var stem = {
					"title": n.textContent,
					"href": 'forums.php'+n.getAttribute('href')
				}
				links.push(stem);
			});
			sessionStorage["forumsMenu"] = JSON.stringify(links);
			appendSubMenu('#topMenu a.forums nav', links);
		});
	} else {
		appendSubMenu('#topMenu a.forums nav', JSON.parse(sessionStorage["forumsMenu"]));
	}

	if(sessionStorage["marketsMenu"] == undefined) {
		$.get('markets.php', function(response){
			var links = [];
			$('td.embedded > a', response).each(function(i,n){
				var stem = {
					"title": n.textContent,
					"href": 'markets.php'+n.getAttribute('href')
				}
				links.push(stem);
			});
			sessionStorage["marketsMenu"] = JSON.stringify(links);
			appendSubMenu('#topMenu a.markets nav', links);
		});
	} else {
		appendSubMenu('#topMenu a.markets nav', JSON.parse(sessionStorage["marketsMenu"]));
	}
	
	$('#aToBookmarks').append('<nav></nav>');
	if(localStorage['hm_bookmarks'] == undefined) {
		$.post(SITEBASEURL+'bookmarks.php/list', {'xid': XID}, function(response){
			localStorage['hm_bookmarks'] = JSON.stringify(response);
			updateBookmarks();
		});	
	} else { updateBookmarks(); }

	$(document).on('click', '.hm_delete_bookmark', function(){
		var k =$(this).text();
		var oBookmarks = JSON.parse(localStorage['hm_bookmarks']);
		var XID = document.cookie.match(/xid=\d+/gi).toString().substr(4);
		if(window.confirm('โปรดยืนยันว่าต้องการลบ Bookmark กระทู้ \n'+oBookmarks[k].title)) {
			$.post(SITEBASEURL+'bookmarks.php/delete', {'xid':XID, 'topicid':k}, function(response){
				if(response) {
					delete oBookmarks[k];
					localStorage['hm_bookmarks'] = JSON.stringify(oBookmarks);
					updateBookmarks();
				} else {
					alert('FAILED.');
				}
			});
		}
		return false;
	});
	
	$('a.sub nav').each(function(){
		if($(this).width() > $(this).parent().width()+10) {
			$(this).addClass('trr');
		} else {
			$(this).removeClass('trr');
		}
	});
	$(window).on('resize', function(){
		$('a.sub nav').each(function(){
			if($(this).width() > $(this).parent().width()+10) {
				$(this).addClass('trr');
			} else {
				$(this).removeClass('trr');
			}
		});
	});
};

function mod_userHistory() {
	//$('table.mainouter > tbody > tr > td > table.main').attr('width','95%');
	$('body').css('overflow-y', 'scroll');
	$('td.comment').hide();
	$('td.comment img').css({'max-width':'256px', 'max-height':'256px'});

	$('td.embedded > table > tbody > tr > td > p.sub').addClass('mod').each(function(){
		var table = $('table', this).detach();
//		$('font[color="red"]', table).appendTo(this).wrap('<a class="new"></a>');
		if($('font[color="red"]', table).length) {
			$('a:eq(1)', table).addClass('topic').addClass('new').appendTo(this);
		} else {
				$('a:eq(1)', table).addClass('topic').appendTo(this);
		}
		$('a:eq(0)', table).addClass('forum').attr('title', function(i,v){return this.textContent;}).appendTo(this);
		$('a:eq(0)', table).clone().addClass('post').attr('title', 'Jump to this comment').appendTo(this);
		$('a.topic', this).clone().removeClass('topic new').addClass('last').text('').attr('title', 'Jump to latest comment').attr('href', function(i,v){return v+'&page=last#last';}).appendTo(this);
		$(this).append('<a class="toggle" title="Show/hide comment">Show</a>');
		table.remove();
	});
	
	$('a.toggle').on('click', function(){
		//console.log($(this).parent().next());
		$('td.comment', $(this).parent().next()).slideToggle();
	});
};

function mod_titleFix() {
	var H1 = $('h1:first').clone();
	$('a', H1).remove();
	var title = $(H1).text();
	document.title = title.substr(2);
};

function mod_revealLinks() {
	$('td.comment').prepend('<div class="hm_all_links"></div>');
	$('td.comment').each(function(i, n){
		var ix = this.innerHTML.indexOf("<br>------------------------<br>");
		if(ix>=0){
			var comment = '<div>'+this.innerHTML.substring(0, ix)+'</div>';
		} else {
			var comment = '<div>'+this.innerHTML+'</div>';
		}
		var div = $('.hm_all_links', this);
		
		$('a', $(comment)).each(function(){
			if(this.href.indexOf('userdetails.php') > -1) { 
				return; 
			} else {
				$('<a></a>')
					.addClass('hm_reveal_link')
					.attr('href', this.href)
					.attr('target', '_blank')
					.appendTo(div)
				;
			}
		});
 	});
};

function mod_hideSignature() {
	$('td.comment').each(function(i, n){
		var ix = this.innerHTML.indexOf("<br>------------------------<br>");
		if(ix>=0){
			this.innerHTML = this.innerHTML.substring(0,ix);
		}
 	});
};

function mod_autoResizeImageLinks(maxWidth) {
	$('td.comment img:not([alt])').css('max-width', maxWidth);
	$('td.comment img:not([alt])').each(function(i,n){
		if(!$(this).parent().is('a')) {
			$(this).wrap('<a class="gallery" rel="gal" href="'+this.src+'"></a>');
		}
	});

	$('.gallery').colorbox({rel:'gal', retinaImage:true, scalePhotos:true, maxWidth:'90%', maxHeight:'90%'});
	
	$('td.comment a:not(:has(img))').addClass('ellipsis').css('max-width', maxWidth+'px');
};

function mod_quickReply() {

	function update_smilies() {
		$.get('smilies.php', function(response){
			var tbody = $('td.colhead',response).parent().parent();
			var smilies = {};
			$('tr:has(img)', tbody).each(function(i,n){
				var tag = $('td:first-child', this).text();
				var url = $('img', this).attr('src');
				smilies[tag] = url;
			});
			localStorage['smilies'] = JSON.stringify(smilies);
			//if(arguments[0] !== undefined) { (arguments[0])(); }
		});
	}

	function update_smilies_list() {
		$('#hm_smilies_list').empty();
		var smilies = JSON.parse(localStorage['smilies']);
		for(tag in smilies) {
			var img = new Image();
			img.src = smilies[tag];
			var stylestr = "background-image:url('"+smilies[tag]+"');";
			if(img.height > 64 || img.width > 64) {
				stylestr += "background-size: contain;"
			}
			delete img;
			img = undefined;
			$('#hm_smilies_list').append('<li style="'+stylestr+'" title="'+tag+'" />');
		}
		//console.log($('#hm_smilies_list'));
	}

	$('p:has(input.btn):first').before('<form action="?action=post" method="post" id="hm_quickreply"></form>');
	var topicid = document.URL.match(/topicid\=(\d+)/);
	topicid = topicid[1];
	$('#hm_quickreply')
		.append('<h2>Quick Reply</h2>')
		.append('<input type="hidden" name="topicid" value="'+topicid+'" />')
		.append('<div><textarea name="body" style="width:100%" id="hm_text_quickreply"></textarea></div>')
		.append('<div style="text-align:center;position:relative;"><input type="submit" value="Submit" /></div>')
	;
	
	$('a[href*="action=quotepost"]').after('<a class="hm_quickquote">&nbsp;</a>');
	
	$('.hm_quickquote').on('click', function(){
		var url = $(this).prev().attr('href');
		// get quote bbcode from web
		$.get(url, function(data){
			var text = $('textarea:first', data).val();
			text = text.replace(/\[youtube\](\w+)\[\/youtube\]/g, '[yt][url]http://www.youtube.com/watch?v=$1[/url][/yt]');
			text = text.replace(/\[img\](.+)\[\/img\]/g, '[image][url]$1[/url][/image]');
			// insert quote bbcode to quickreply textarea
			$('#hm_text_quickreply').val(function(i,v) {
				if(v != '') { v+= "\n"; }
				v += text+"\n";
				return v;
			});			
		});
	});

	//Quick Quote
	if(!isNaN(topicid[1])) {
		topicid = Number(topicid[1]);
		var formSubmitted = false;
		// carry textarea to next page
		$(window).on('beforeunload', function(){
			if(formSubmitted) {
				sessionStorage['hm_quickquote_clipboard_'+topicid] = undefined;
			} else {
				if($('#hm_text_quickreply').val() != '') {
					sessionStorage['hm_quickquote_clipboard_'+topicid] = $('#hm_text_quickreply').val();
				}
			}
		});
		if(sessionStorage['hm_quickquote_clipboard_'+topicid] == 'undefined') {
			sessionStorage['hm_quickquote_clipboard_'+topicid] = '';
		} else {
			$('#hm_text_quickreply').val(sessionStorage['hm_quickquote_clipboard_'+topicid]);
		}
		$('#hm_quickreply').on('submit', function(){
			formSubmitted = true;
			sessionStorage['hm_quickquote_clipboard_'+topicid] = undefined;
		});
	}
	
	//Smilies
	if(localStorage['smilies'] == undefined) { update_smilies(); }
	$('#hm_quickreply').append('<div id="btn_smilies"><ul id="hm_smilies_list"></ul></div>');
	update_smilies_list();

	$('#hm_smilies_list').on('click', 'li', function(){
		var text = this.title;
		$('#hm_text_quickreply').val(function(i,v){ return v+text+' '; });
	});
};

function mod_openNewTab() {
	$('a[href^="details.php"]').attr('target', '_blank');
	$('td.comment a').attr('target', '_blank');
	if(/forums.php$/.test(document.URL) || /markets.php$/.test(document.URL)) {
		$('a[href^="?action=viewtopic"]').attr('target', '_blank');
	}
	if(/action\=viewforum/.test(document.URL)) {
		$('a[href^="?action=viewtopic"]').attr('target', '_blank');
	}
	
	if(/details.php/.test(document.URL)) {
		//details page
		$('table[width="750"] tr td:nth-child(2) a, .text a').attr('target', '_blank');
	}
	
	if(/userhistory.php/.test(document.URL)) {
		// post history page
		$('p.sub a').attr('target', '_blank');
	}
};

function mod_cleanBrowse() {
	function checksum(s) { 
		var i;
		var chk = 0x12345678;
		for (i = 0; i < s.length; i++) {
			chk += (s.charCodeAt(i) * (i + 1));
		}
		return chk.toString(16);
	}
	
	$('img[alt="pet"]').remove();
	$('img[src="pic/xl.gif"]').remove();
	$('img[src="pic/xr.gif"]').remove();
	$('a[href*="details.php"] b').html(function(index, content){
		var brk = content.match(/\[[^\]]+\]/g);
		if(brk) {
			var tags = $('<ul></ul>');
			$(tags).addClass('henmee_browse_tags_ul');
			for (i=0; i<brk.length; i++) {
				var cs = checksum(brk[i].replace(/\[|\]/g, ''));
				//console.log(cs);
				$('<li></li>').addClass('henmee_browse_tags_li').attr('tag',cs).text(brk[i].replace(/\[|\]/g, '')).on('click', function(){
					var tag = $(this).attr('tag');
					if($(this).hasClass('btlihilight')) {
						$('.btlihilight').removeClass('btlihilight');
					} else {
						$('.btlihilight').removeClass('btlihilight');
						$('.henmee_browse_tags_li[tag="'+tag+'"]').toggleClass('btlihilight');
					}
				}).appendTo($(tags));
				content = content.replace(brk[i], '');
			}
			content = content.replace(/^[ -]*/g, '');
			content = content.replace(/[ -]*$/g, '');
			content = content.replace(/720p/i, '<span class="torrent_720p">720p</span>');
			content = content.replace(/1080p/i, '<span class="torrent_1080p">1080p</span>');
			content = content.replace(/(3D)/i, '<span class="torrent_3d">$1</span>');
			$(this).parent().parent().append(tags);
			return content;
		}
		//console.log(brk);
	});
};

function mod_superBrowse() {
	var tAs = document.querySelectorAll('td[align=left]>a[href^=details]');
	for(var i=0; i<tAs.length; i++) {
		var Ax = tAs[i];
		var torrentId = /id=(\d+)/.exec(Ax.href)[1];
		var goA = '<a class="hm_btn_go_torrent" href="'+Ax.href+'" target="_blank" title="Torrent details"></a>';
		var dlA = "/download.php?file=/"+torrentId+"/download.torrent";
		dlA = '<a href="'+dlA+'" class="hm_btn_download_torrent" title="Download this torrent"></a>';
		var bmA = "bookmark.php?op=add&id="+torrentId;
		bmA = '<a href="'+bmA+'" class="hm_btn_bookmark_torrent" target="_blank" title="Bookmark this torrent"></a>';
		Ax.parentNode.classList.add("hm_superbrowse_td");
		console.log(Ax.parentNode);
		Ax.parentNode.innerHTML += '<div class="hm_btn_container">'+goA+dlA+bmA+'</div>';
	}
};

function mod_resizePet() {
	$('img[alt="pet"]').addClass('pet');
};

function mod_unlockWidth() {
	$('table.mainouter > tbody > tr > td > table.main').removeAttr('width').css('min-width', '750px');
};

function mod_bookmark() {
	$('<a id="hm_bookmark_button"></a>').on('click', function(){
		var XID = document.cookie.match(/xid=\d+/gi).toString().substr(4);
		var oBookmarks = JSON.parse(localStorage['hm_bookmarks']);
		var topicid = document.URL.match(/topicid=(\d+)/);
		topicid = topicid[1];
		var topictitle = $('h1:first').text();
		var url = document.URL.replace(/#\d+/, '');
		oBookmarks[topicid] = {'topicid':topicid, 'url':url, 'title':topictitle};
		var postBody = {'xid':XID, 'topicid':topicid, 'url':url, 'title':topictitle};
		$.post(SITEBASEURL+'bookmarks.php/add', postBody, function(response){
			if(response) {
				localStorage['hm_bookmarks'] = JSON.stringify(oBookmarks);
				updateBookmarks();
			} else {
				alert('FAILED.');
			}
		});
	}).attr('title', 'Bookmark this topic').prependTo('h1:first');
};
