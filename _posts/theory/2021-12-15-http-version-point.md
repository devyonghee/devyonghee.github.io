---
title: http 버전별 특징
tags: [http]
categories: theory
---

웹 상에서 서버와 클라이언트간 통신하기 위해 http 를 사용한다.  
이러한 http의 역사와 버전별로 특징에 대해서 알아보도록 하자.
    
<!--more-->

## http/0.9 - 원라인 프로토콜

1991년에 [문서화](https://www.w3.org/Protocols/HTTP/AsImplemented.html) 된 최초의 http 버전이 나왔으며 이 버전이 http/0.9 이다.
http 초기 버전으로 버전 번호가 없었지만 다른 버전과 구별하기 위해 버전이 붙여졌다.   
http 헤더, 상태, 오류 코드 등이 존재하지 않으며 HTML 파일만 전송 가능하다.

### 요청
- CRLF(carriage return, line feed)으로 끝나는 ASCII 문자열로 문서 요청
- 메소드는 `GET`이 유일

### 응답
- ASCII 문자로 이루어진 HTML 메세지
- 오류 응답도 HTML 구문의 사람이 읽을 수 있는 텍스트



https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP
https://ko.wikipedia.org/wiki/HTTP
https://www.whatap.io/ko/blog/38/
https://blog.naver.com/qja9605/222269034552
https://kyun2da.dev/CS/http%EC%9D%98-%EC%97%AD%EC%82%AC%EC%99%80-http2%EC%9D%98-%EB%93%B1%EC%9E%A5/
https://developers.google.com/web/fundamentals/performance/http2?hl=ko#%EC%8A%A4%ED%8A%B8%EB%A6%BC_%EB%A9%94%EC%8B%9C%EC%A7%80_%EB%B0%8F_%ED%94%84%EB%A0%88%EC%9E%84

https://hpbn.co/brief-history-of-http/