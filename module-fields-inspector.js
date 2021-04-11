let elStrings = {
  popup: '' +
  '<div class="fields-json-popup-super-wrapper" style="position: absolute;z-index: 9999999;background: white;top: 80px;padding: 20px;width: 70vw;height: 70vh;">' +
     '<div class="uiPopover--default uiPopover" style="position: relative;">' +
        '<header class="uiPopoverHeader private-popover__header">' +
           '<h4>Module Fields JSON</h4>' +
        '</header>' +
        '<div class="uiPopoverBody private-popover__body">' +
           '<textarea readonly style="width:100%;height:56vh;" class="fields-json-preview-textarea"></textarea>' +
        '</div>' +
        '<footer class="uiPopoverFooter private-popover__footer">' +
           '<div class="text-center"><button type="button" aria-disabled="false" class="module-fields-json-dismiss-trigger btn uiButton private-button private-button--default private-button--secondary btn-default private-hoverable private-button--non-link" tabindex="0"><span>Dismiss</span></button></div>' +
        '</footer>' +
     '</div>' +
  '</div>',
  button: '<button class="fields-json-popup-trigger uiButton private-button private-button--tertiary-light private-button--xs private-button--non-link m-right-2"><span>Fields JSON</span></button>'
}
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
setInterval(() => {
  if(!$('.fields-json-popup-trigger').length){
    $('.fields-json-popup-super-wrapper').remove();
    waitForElm('.private-tool-bar__group').then((elm) => {renderFieldsJsonFunctionality(elm)});
  }
}, 1000)
function renderFieldsJsonFunctionality(elm){
  if(!$('.fields-json-popup-trigger').length){
    $(elm).children('div').first().prepend(elStrings.button)
  }
  $('.fields-json-popup-trigger').on('click', function(){
    let moduleID = $('.private-tabs__list__wrapper').find('a.file-tab.is--active').data('tab-id');
    let target = 'https://api.hubspot.com/designmanager/v1/modules/'+moduleID+'/buffer?portalId='+document.cookie.split('; ').find(row => row.startsWith('__hssluid=')).split('=')[1];
    let headers = {credentials: "include", headers: {"x-hubspot-csrf-hubspotapi": document.cookie.split('; ').find(row => row.startsWith('hubspotapi-csrf=')).split('=')[1]}};
    fetch(target, headers).then(function (response) {
    	return response.json();
    }).then(function (data) {
      $('.fields-json-popup-trigger').closest('.resizable-pane').prepend(elStrings.popup);
      $('.fields-json-preview-textarea').val(JSON.stringify(data.fields, undefined, 4))
      $('.module-fields-json-dismiss-trigger').on('click', function(){
        $('.fields-json-popup-super-wrapper').remove();
      })
    });
  })
}
