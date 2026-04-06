# Prompt Log: photo-list

## [Plan] 2026-04-06T14:57:22Z

React 웹페이지 하나 만들어줘. 
API를 호출해서 사진 리스트를 받아와서, 3열 그리드 세로 스크롤로 만들어줘.
사진 리스트 API: https://jsonplaceholder.typicode.com/photos 
사진을 누르면 상세 페이지로 이동하게도 해줘.

## [Iterate] 2026-04-06T15:25:00Z

내가 준 API 주소에 문제가 있네. Response의 이미지 URL로 접속해도 이미지가 나오지 않아.  
API 형식을 변경하려고 해. 
API: https://dummyjson.com/products 
표시할 이미지: https://dummyjson.com/icon/product_{product.id}/500

## [Iterate] 2026-04-06T15:35:29Z

이미지를 표시하는 로직을 Response에 있는 이미지를 표시하도록 해줘.
