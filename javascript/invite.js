$(function () {
  function onScrollElem (query) {
    var $elem = $(query)
    var $elemTop = $elem.offset().top
    var height = $(window).height()
    var windowScrollTop = $(window).scrollTop()
    if (windowScrollTop >= $elemTop - height + 200 && !$elem.hasClass('animation')) {
      $elem.addClass('animation')
    }
  }

  function backTop() {
    $('html,body').animate({ scrollTop: 0 }, 500)
  }
  $('#backTop').click(backTop)

  function main () {
    onScrollElem('#advertS2')
    onScrollElem('#advertS3')
    onScrollElem('#advertS4')
    if ($(window).scrollTop() > $(window).height()) {
      $('#backTop').slideDown(500)
    } else {
      $('#backTop').slideUp(500)
    }
  }
  main()

  $(window).scroll(main)
});