/*
  If we use jQuery here, we should include jQuery in the "content_scripts" field in manifest.json.

  Reference:
    https://developer.chrome.com/extensions/overview
    https://developer.chrome.com/extensions/content_scripts
*/

$(function(){
  mainJob(document.URL);
});

function mainJob(url){
  /*
    1. [REGEX in javascript]
      We do not need double quote "" here, because the function match(reg) requires RGEEX in its argument, and string confounded by double forward slash /MY_REG/ is the RGEEX in javascript

    2. [i18n in Chrome Extension]
      https://developer.chrome.com/extensions/i18n
  */

  // https://tw.dictionary.yahoo.com/dictionary?p=wall
  if(url.match(/http[s]?:\/\/*tw.dictionary.yahoo.com\/*/)){
    if(!$("audio source").length){
      return false;
    }
    audio_url = $("audio source").attr("src");
    insert_download_link(audio_url, '.button-audio');
  }

  // http://www.oxfordlearnersdictionaries.com/definition/english/wall_1?q=wall
  else if(url.match(/http:\/\/*www.oxfordlearnersdictionaries.com\/*/)){
    if(!$(".audio_play_button").length){
      return false;
    }
    $(".audio_play_button").each(function( index ) {
      audio_url = $( this ).attr("data-src-mp3");
      insert_download_link(audio_url, $(this));
    });
  }

  // http://jisho.org/
  else if(url.match(/http:\/\/*jisho.org\/*/)){
    if(!$("a.concept_audio").length){
      return false;
    }
    $("a.concept_audio").each(function( index ) {
      audio_url = $( this ).prev().children().first().attr("src");
      insert_download_link(audio_url, $(this));
    });
  }

  // https://www.moedict.tw/
  else if(url.match(/http[s]?:\/\/*www.moedict.tw\/*/)){
    if(!$(".icon-play.playAudio").length){
      return false;
    }
    $(".icon-play.playAudio").each(function( index ) {
      audio_url = $( this ).children().filter(function(){
        return $(this).attr("itemprop")=="contentURL";
      }).attr("content");
      insert_download_link(audio_url, $(this));
    });
  }

  // http://dictionary.cambridge.org/
  else if(url.match(/http[s]?:\/\/*dictionary.cambridge.org\/*/)){
    if(!$(".sound.audio_play_button").length){
      return false;
    }
    $(".sound.audio_play_button").each(function( index ) {
      audio_url = $( this ).attr("data-src-ogg");
      insert_download_link(audio_url, $(this));
    });
  }

  // http://www.godic.net/
  else if(url.match(/http[s]?:\/\/*www.godic.net\/*/)){
    if(!$("#dict-body .voice-js.voice-button").length){
      return false;
    }
    $("#dict-body .voice-js.voice-button").each(function( index ){
      // 排除掉中文發音
      if(!$(this).attr("data-rel").match(/langid=de*/)){
        // If we "return false" here, we will accidentally break out of each() loops early. see http://api.jquery.com/each/
        return;
      }
      audio_url = "http://api.frdic.com/api/v2/speech/speakweb?" + $(this).attr("data-rel");
      insert_download_link(audio_url, $(this));
    });
  }

  // http://www.frdic.com/
  else if(url.match(/http[s]?:\/\/*www.frdic.com\/*/)){
    if(!$("#dict-body .voice-js.voice-button").length){
      return false;
    }
    $("#dict-body .voice-js.voice-button").each(function( index ){
      // 排除掉中文發音
      if(!$(this).attr("data-rel").match(/langid=fr*/)){
        // If we "return false" here, we will accidentally break out of each() loops early. see http://api.jquery.com/each/
        return;
      }
      audio_url = "http://api.frdic.com/api/v2/speech/speakweb?" + $(this).attr("data-rel");
      insert_download_link(audio_url, $(this));
    });
  }

  // http://www.japanesepod101.com/
  else if(url.match(/http[s]?:\/\/*www.japanesepod101.com\/japanese-dictionary\/*/)){
    if(!$("#dictionary_results .Dictionary .Dictionary_Eng img").length){
      return false;
    }
    $("#dictionary_results .Dictionary .Dictionary_Eng img").each(function( index ){
      // tmp = PlaySound('http://assets.languagepod101.com/dictionary/japanese/audiomp3.php?id=97886');
      var tmp = $(this).attr("onclick");
      audio_url = tmp.substring(11, tmp.length-3);
      insert_download_link(audio_url, $(this));
    });
    $("#dictionary_results .Dictionary .Dictionary_Eng_Alt img").each(function( index ){
      // Too lazy to tidy up duplicated codes
      var tmp = $(this).attr("onclick");
      audio_url = tmp.substring(11, tmp.length-3);
      insert_download_link(audio_url, $(this));
    });
  }

  // http://www.learnersdictionary.com/definition/dog
  else if(url.match(/http[s]?:\/\/*www.learnersdictionary.com\/*/)){
    if(!$(".fa.fa-volume-up.play_pron").length){
      return false;
    }
    $(".fa.fa-volume-up.play_pron").each(function( index ) {
      var dir = $( this ).attr("data-dir");
      var file = $( this ).attr("data-file");
      audio_url = "http://media.merriam-webster.com/audio/prons/en/us/mp3/" + dir + "/" + file + ".mp3";
      insert_download_link(audio_url, $(this));
    });
  }

  // https://tw.voicetube.com/definition/prodigy?ref=def
  else if(url.match(/http[s]?:\/\/*tw.voicetube.com\/definition\/*/)){
    if(!$(".audioButton").length){
      return false;
    }
    $(".audioButton").each(function( index ) {
      audio_url = "https://tw.voicetube.com" + $( this ).attr("href");
      insert_download_link(audio_url, $(this).parent().parent());
    });
  }

  // http://www.merriam-webster.com/dictionary/cat
  else if(url.match(/http[s]?:\/\/*www.merriam-webster.com\/dictionary\/*/)){
    if(!$(".play-pron").length){
      return false;
    }
    $(".play-pron").each(function( index ) {
      var dir = $( this ).attr("data-dir");
      var file = $( this ).attr("data-file");
      audio_url = "http://media.merriam-webster.com/audio/prons/en/us/mp3/" + dir + "/" + file + ".mp3";
      insert_download_link(audio_url, $(this));
    });
  }

  // http://yun.dreye.com/dict_new/dict.php?w=dog&hidden_codepage=01
  // http://yun.dreye.com/dict_new/dict.php?w=accordance
  else if(url.match(/http[s]?:\/\/*yun.dreye.com\/dict_new\/*/)){
    // 從網址取得查詢的單字
    // Could use split(regex) here to make it less ugly
    var tmp = url.split('=')[1];
    var vocab = tmp.split('&')[0];
    if(!vocab){
      return false;
    }
    // 取得第一個字母，並將其轉成大寫，例如 'a' -> 'A'
    var dir = vocab.charAt(0).toUpperCase();
    // 真人發音(男)
    if($("#real_pron_m").length){
      $("#real_pron_m").each(function( index ) {
        audio_url = "http://yun.dreye.com/dict_new/media/" + dir + "/" + vocab + ".mp3";
        insert_download_link(audio_url, $(this));
      });
    }
    // 真人發音(女)
    if($("#real_pron_f").length){
      $("#real_pron_f").each(function( index ) {
        audio_url = "http://yun.dreye.com/dict_new/female_media/" + dir + "/" + vocab + ".mp3";
        insert_download_link(audio_url, $(this));
      });
    }
  }

  // http://www.thai-language.com/
  else if(url.match(/http[s]?:\/\/*www.thai-language.com\/*/)){
    if(!$("#browse-table .object").length){
      return false;
    }
    $("#browse-talbe .object").each(function( index ){
      if(!$(this).attr("data")){
        // If we "return false" here, we will accidentally break out of each() loops early. see http://api.jquery.com/each/
        return;
      }
      audio_url = "http://www.thai-language.com/audio/" + $(this).attr("data");
      insert_download_link(audio_url, $(this));
    });
  }




  else{
    console.log("no match");
    return false;
  }
}

function insert_download_link(audio_url, insert_after){
  console.log("audio_url = " + audio_url);
  img_url = chrome.extension.getURL('icons/icon_24.png');
  $("<a target='_blank' href='" + audio_url + "'>" + chrome.i18n.getMessage("textDownloadAudio") + "<img src='" + img_url + "' alt='Download Audio' height='16' width='16'></a>").insertAfter(insert_after);
}


/*
  `content_script.js` and `background.js` use "Message Passing" to communicate with each other.
  FYI, `background.js` controls `page action`.

  Reference:
    https://developer.chrome.com/extensions/pageAction
    https://developer.chrome.com/extensions/messaging
*/
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "onClickedPageActionButton"){
      mainJob(document.URL);
      sendResponse({farewell: "goodbye"});
    }
});
