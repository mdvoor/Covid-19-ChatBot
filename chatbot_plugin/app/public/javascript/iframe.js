console.log(location.origin)
(function(){'use-strict';
    // if the iframe is on a different domain or protocal, then change
    // iframepageorigin to the domain and protocal of the iframe, an array
    // of domains and protocals, or "*" to allow all (which I don't recommend).
    // You can also use regexps (for case-insensitivity) in place of strings
    var iframepageorigin = location.origin,
    observedEles = [ ];
    function run_main_script(){
        var observeFunc,
            firstContactFunc = function(e){
                var msgcnt = 'parentiframeid' + observedEles.indexOf(e.target),
                    cntWin = e.target.contentWindow;
                if (iframepageorigin instanceof Array){
                    var i = iframepageorigin.length;
                    while(i--) cntWin.postMessage(msgcnt,
                            iframepageorigin[i].source||iframepageorigin[i]);
                } else cntWin.postMessage(msgcnt,
                        iframepageorigin.source||iframepageorigin);
            },
            eleObserver = new MutationObserver(observeFunc = function(MOlst){
                var iCur = MOlst.length;
                morep: while (iCur--){
                    target = MOlst[iCur].target || MOlst[iCur];
                    if (target.nodeName !== 'IFRAME' ||
                        ~observedEles.indexOf( target )) continue morep;
                    observedEles.push( target );
                    target.addEventListener('load', firstContactFunc);
                }
            });
        /*window.*/addEventListener('message', function(e){
            var srcOrig = e.target.origin.toLowerCase(),
                msgcnt = e.data.slice('resize'.length).split('X');
            if (msgcnt.length !== 3) return;
            if (iframepageorigin instanceof Array){
                var i = iframepageorigin.length;
                while (i--) if (e.target.origin.match( iframepageorigin[i] ))
                            observedEles[+msgcnt[0]].width = msgcnt[1] + 'px',
                            observedEles[+msgcnt[0]].height = msgcnt[2] + 'px';
            } else if (e.target.origin.match(iframepageorigin[i]) ||
                        iframepageorigin ==='*' )
                observedEles[+msgcnt[0]].width = msgcnt[1] + 'px',
                observedEles[+msgcnt[0]].height = msgcnt[2] + 'px';
        });
        eleObserver.observe( document.body,
          { subtree: true, attributes: true, attributeFilter: ['src'] } );
        addEventListener('load', 
            observeFunc.bind(0, document.getElementsByName('iframe')) );
    };
    if (!window.MutationObserver){ // polyfill for IE9 & IE10
        var script=document.createElement('script');
        script.onload=run_main_script, script.async=true, script.src= 
 'https://www.dropbox.com/s/ft95wfv4ahow63u/mutationobserverpolyfill.js?dl=1';
        document.head.appendChild(script);
    } else run_main_script();
})();