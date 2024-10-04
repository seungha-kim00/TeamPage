$(window).on("load", function () {
  setTimeout(function () {
    $(".spinner").hide(); // 스피너 요소를 숨김
    $(".content").show(); // 컨텐츠를 표시
  }, 3000); // 3초 후 로딩 완료
});
