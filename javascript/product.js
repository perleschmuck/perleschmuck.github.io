$(function () {
  $(window).scroll(function () {
    onScrollElem('#productS2')
    onScrollElem('#productS7')
    onScrollElem('#productS6')
    if ($(window).scrollTop() > $(window).height()) {
      $('#backTop').slideDown(500)
    } else {
      $('#backTop').slideUp(500)
    }
  })

  function onScrollElem(query){
    var $elem = $(query)
    var $elemTop = $elem.offset().top
    var height = $(window).height()
    var windowScrollTop = $(window).scrollTop()
    if (windowScrollTop > $elemTop - height + 500 && !$elem.hasClass('animation')) {
      $elem.addClass('animation')
    }
  }

  function backTop() {
    $('html,body').animate({ scrollTop: 0 }, 500)
  }
  $('#backTop').click(backTop);

  window.fetchGoodsInfo(function (data) {
    $('#price').text('￥' + data.price)
  })
});