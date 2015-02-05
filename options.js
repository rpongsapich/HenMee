chrome.runtime.sendMessage({action:"getPrefs"}, function(prefs){
	//console.log(prefs);
	for(var name in prefs) {
		var item = prefs[name];
		var html = '<div class="option"><label for="'+name+'">'+item.title+'</label><input name="'+name+'" type="'+item.type+'" id="'+name+'" value="'+item.value+'" /></div>';
		$('body').append(html);		
	}
	$('input:checkbox')
		.prop('checked', function(){ return this.getAttribute('value')=='true'; })
		.on('click', function(){ 
			var that = this;
			chrome.runtime.sendMessage({action:"setPref", item:that.getAttribute('id'), value:$(that).prop('checked')}, function(val){
				that.setAttribute('value', val);
			});
		});
	
	$('input[type="number"]')
		.on('input', function(){
			if(isNaN(parseInt(this.value))) { $(this).addClass('error'); return false; } else { $(this).removeClass('error'); }
			var that = this;
			chrome.runtime.sendMessage({action:"setPref", item:that.getAttribute('id'), value:that.value}, function(val){
				that.value = val;
			});
		});
});