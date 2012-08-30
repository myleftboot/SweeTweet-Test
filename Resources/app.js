// This is a test harness for sweetTweet.
// It shows how to implement the module.
// Copyright 2012 Cope Consultancy Services
// OK its not going to win any prizes for Javascript style, but come on, its only a test script...

var test = require('tmm.tweet');

var defAcct = null;
var piccy = [];

// open a single window
var win = Ti.UI.createWindow({
	backgroundColor:'black'
});

var view = Ti.UI.createView({layout:'vertical'});
var label = Ti.UI.createTextField({backgroundColor:'white',
                                   hintText:'put the tweet text here.',
                                   color:'#336699',
                                   height:40,
                                   top:50,
                                   width:300});
view.add(label);

Ti.API.info('Version'+Titanium.Platform.version);

if (Titanium.Platform.version >= 5.0) {Ti.API.info('IOS5')}
else {Ti.API.error('This is not going to work....You need iOS5')}

var setDefaultAccount = Ti.UI.createButton({
			title:		'Set Account',
			height:		40,
			width:		150,
		});

setDefaultAccount.addEventListener('click', function(e){
	Ti.API.info('Calling getAccount');
		test.getAccount({success:	function(e){
							Ti.API.info('Account Selected = '+e.selectedAccount);
							defAcct = e.selectedAccount
						},
                        noAccount: function(obj) { alert('User has no twitter accounts on the device'); },
						vw: view}
			);
});

var listAccounts = Ti.UI.createButton({
			title:		'Account List',
			height:		40,
			width:		150,
		});

listAccounts.addEventListener('click', function(e){
	Ti.API.info('Calling getAccountsDict');
	var accounts=new Array(); 
    test.getAccountsDict({accounts: function(obj) { alert('getAccountsDict called'); 
                                                    accounts=obj.accounts;
                                                    for (var i=0; i<accounts.length; i++) {
                                                    	Ti.API.info(i+accounts[i]); 
                                                    }
                                                    }});
});

var photo = Ti.UI.createButton({
			title:		'Add Photo',
			height:		40,
			width:		150,
		});
		
photo.addEventListener('click', function(e){
	Ti.Media.openPhotoGallery
			({
			    success:								function(event) {Ti.API.info('Setting piccy'); piccy = [event.media];},
				mediaTypes:								[Ti.Media.MEDIA_TYPE_PHOTO],
				allowEditing:							true,
			    autohide:								true,
			    animated:								false
			});
});

var tweet = Ti.UI.createButton({
			title:		'Tweet it',
			height:		40,
			width:		150,
		});
tweet.addEventListener('click', function(e){
	Ti.API.info('account is '+ defAcct);
	
		test.tweet({ message: label.value,  /* the message to tweet */
    	                account:   defAcct, /* the Twitter account to send the tweet from, can be left blank */
                        urls:      ['copeconsultancy.co.uk/apps'], /* a url to attach to the tweet, optional */
                        image:     piccy, /* a Ti.blob image to attach to the tweet, optional */
                        success:   function(obj) { alert('Tweet successfully sent'); Ti.API.info('Status Code = '+obj.result); },
                        cancel:    function(obj) { alert('User has cancelled tweet'); },
                        error:     function(obj) { alert('Unable to send tweet'); Ti.API.info('Status Code = '+obj.result); },
                        noAccount: function(obj) { alert('User has no twitter accounts on the device'); },
                        vw:        view /* the current view being shown. Used to show the twitter account selection dialog */});
});

var tweetSheet = Ti.UI.createButton({
			title:		'Tweet with Sheet',
			height:		40,
			width:		150,
		});
tweetSheet.addEventListener('click', function(e){

		test.tweetWithSheet({animate: "yes", 
                             success: function() { alert('Tweet successfully sent'); },
                             cancel: function() { alert('User has cancelled tweet'); }
                             }); 
});

view.add(setDefaultAccount);
view.add(listAccounts);
view.add(photo);
view.add(tweet);
view.add(tweetSheet);
win.add(view);
win.open();