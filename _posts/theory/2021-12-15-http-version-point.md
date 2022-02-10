---
title: http 버전별 특징
tags: [http]
categories: theory
---

웹 상에서 서버와 클라이언트간 통신하기 위해 http 를 사용합니다.  
이러한 http의 역사와 버전별로 특징에 대해서 알아보도록 하겠습니다.
    
<!--more-->

## HTTP/0.9 - 원라인 프로토콜

1991년에 [문서화](https://www.w3.org/Protocols/HTTP/AsImplemented.html) 된 최초의 http 버전이 나왔으며 이 버전이 http/0.9 입니다.
http 초기 버전으로 버전 번호가 없었지만 다른 버전과 구별하기 위해 버전이 붙여졌습니다.   
http 헤더, 상태, 오류 코드 등이 존재하지 않으며 HTML 파일만 전송 가능합니다.

### 요청
- CRLF(carriage return, line feed)으로 끝나는 ASCII 문자열로 문서 요청됩니다.
- 메소드는 `GET`이 유일합니다.

```text 
GET /mypage.html
```

### 응답
- ASCII 문자로 이루어진 HTML 메세지입니다.
- 오류 응답도 HTML 구문의 사람이 읽을 수 있는 텍스트입니다.

```text 
<HTML>
A very simple HTML page
</HTML>
```

## HTTP/1.0

1996년 5월 HTTP-WG는 Http/1.0 대해 문서화한 [RFC 1945](https://tools.ietf.org/html/rfc1945) 발표되었습니다.

- request header 에 버전 정보가 추가되었습니다.
- 응답 헤더 뒤에 응답 상태가 추가되었습니다.
- HTTP 헤더 개념이 도입되어, 메타데이터 전송을 허용하고 프로토콜을 유연하고 확장 가능하도록 만들어졌습니다.
- HTTP 헤더의 `Content-Type` 도움으로 HTML 이외에 다른 파일도 전송이 가능해졌습니다.

```text
GET /mypage.html HTTP/1.0
User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

200 OK
Date: Tue, 15 Nov 1994 08:12:31 GMT
Server: CERN/3.0 libwww/2.17
Content-Type: text/html
<HTML>
A page with an image
  <IMG SRC="/myimage.gif">
</HTML>
```

## http/1.1

HTTP/1.0 발표된지 몇달 후, 1997년 1월에 HTTP/1.1 의 초기 버전 [RFC2068](https://datatracker.ietf.org/doc/html/rfc2068) 이 발표되었다.  
그리고 2년 정도 뒤인 1999년 5월에 몇가지 개선과 업데이트가 되고 [RFC2616](https://datatracker.ietf.org/doc/html/rfc2616) 이 발표됐다.

```text 
GET /en-US/docs/Glossary/Simple_header HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header

200 OK
Connection: Keep-Alive
Content-Encoding: gzip
Content-Type: text/html; charset=utf-8
Date: Wed, 20 Jul 2016 10:55:30 GMT
Etag: "547fa7e369ef56031dd3bff2ace9fc0832eb251a"
Keep-Alive: timeout=5, max=1000
Last-Modified: Tue, 19 Jul 2016 00:59:33 GMT
Server: Apache
Transfer-Encoding: chunked
Vary: Cookie, Accept-Encoding

(content)


GET /static/img/header-background.png HTTP/1.1
Host: developer.mozilla.org
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
Referer: https://developer.mozilla.org/en-US/docs/Glossary/Simple_header

200 OK
Age: 9578461
Cache-Control: public, max-age=315360000
Connection: keep-alive
Content-Length: 3077
Content-Type: image/png
Date: Thu, 31 Mar 2016 13:34:46 GMT
Last-Modified: Wed, 21 Oct 2015 18:27:50 GMT
Server: Apache

(image content of 3077 bytes)

```

- 커넥션을 재사용할 수 있게 되어, 사용된 커넥션을 다시 활용할 수 있다.
- 파이프 라이닝이 추가되어, 첫번째 요청에 대해 응답을 받기 전에 다음 요청이 가능해졌다.
- 추가적인 캐시 제어 메커니즘 도입
- content, encoding, language, character set, cookie 등 요청에 대해 협상 가능한 12가지 기능 추가 
- 청크된 응답 가능


## HTTP/2

2009년에 구글에서 개발한 시험용 프로토콜인 SPDY가 발표되었다. 
HTTP/1.1 의 성능 제한을 해결하여 웹페이지 로드 지연시간을 줄이는 것이 목표였다.  
SPDY가 점차 사용되는 곳이 많아지면서 HTTP-WG는 이를 발판으로 더 나은 프로토콜을 빌드하여 개선했다.
그렇게 2015년 5월 RFC 7540(HTTP/2)가 발행되었다.

### 바이너리 프레이밍 계층

{% include image.html alt="binary-framing" path="images/theory/http-version-point/binary-framing.png" caption="바이너리 프레이밍 계층(출처: 구글)" %}

HTTP/2 에서 성능 향상 중 가장 핵심은 새로운 바이너리 프레이밍 계층이다. 
메시지가 캡슐화되어 클라이언트와 서버 사이에 전송되는 방식을 규정한다.  
새 바이너리 인코딩 메커니즘을 사용해야 HTTP/1.x 클라이언트는 HTTP/2 전용 서버를 이해하지 못하고, 



https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP
https://ko.wikipedia.org/wiki/HTTP
https://www.whatap.io/ko/blog/38/
https://blog.naver.com/qja9605/222269034552
https://kyun2da.dev/CS/http%EC%9D%98-%EC%97%AD%EC%82%AC%EC%99%80-http2%EC%9D%98-%EB%93%B1%EC%9E%A5/
https://developers.google.com/web/fundamentals/performance/http2?hl=ko#%EC%8A%A4%ED%8A%B8%EB%A6%BC_%EB%A9%94%EC%8B%9C%EC%A7%80_%EB%B0%8F_%ED%94%84%EB%A0%88%EC%9E%84

https://hpbn.co/brief-history-of-http
