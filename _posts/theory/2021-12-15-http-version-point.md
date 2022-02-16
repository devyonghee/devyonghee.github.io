---
title: HTTP 버전별 특징
tags: [http, network]
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

## HTTP/1.1

HTTP/1.0 발표된지 몇달 후, 1997년 1월에 HTTP/1.1 의 초기 버전 [RFC2068](https://datatracker.ietf.org/doc/html/rfc2068) 이 발표되었습니다.  
그리고 2년 정도 뒤인 1999년 5월에 몇가지 개선과 업데이트가 되고 [RFC2616](https://datatracker.ietf.org/doc/html/rfc2616) 이 발표되었습니다.

- 커넥션을 재사용할 수 있게 되어, 사용된 커넥션을 다시 활용할 수 있습니다.
- 파이프라이닝이 추가되어, 첫번째 요청에 대해 응답을 받기 전에 다음 요청이 가능해졌습니다.
- 추가적인 캐시 제어 메커니즘 도입되었습니다.
- content, encoding, language, character set, cookie 등 요청에 대해 협상 가능한 12가지 기능 추가되었습니다.
- 청크된 응답 가능합니다.

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

### 파이프라이닝(pipelining)

{% include image.html alt="파이프 라이닝 (출처: MDN Web Docs)" path="images/theory/http-version-point/http-pipe-lining.png" %}

기본적으로 HTTP는 순차적으로 요청됩니다. 현재 요청에 대해 응답을 받아야 다음 요청을 할 수 있었습니다. 
하지만 이러한 방식은 네트워크 지연이 발생되고 대역폭 제한에 걸려 딜레이가 생기게 됩니다.

이러한 문제를 개선하기 위해 HTTP/1.1에서 파이프라이닝이 추가되었습니다. 
파이프라이닝은 응답을 기다리지 않고 단일 TCP 연결을 통해 여러 요청을 보낼 수 있습니다. 
이 요청 방식으로 커넥션 지연을 피할 수 있고 성능을 향상시킬 수 있습니다.

모든 요청이 아닌 `GET`, `HEAD`, `PUT`, `DELETE` 메서드 같은 멱등성을 가진 메서드에서만 사용이 가능합니다. 

{% include image.html alt="head of line blocking" path="images/theory/http-version-point/head-of-line-blocking.png" %}

하지만 HTTP/1.1에서 파이프라이닝이 추가되면서 성능을 높일 수 있었지만 큰 문제가 있었습니다. 
첫번째 요청의 응답이 지연된다면 그 다음 요청에 대해서도 지연이 발생됩니다. 
이러한 현상을 HOL(Head of line) Blocking 이라고 합니다.

응답 순서가 요청 순서에 따라야 하는 규칙이 있기 때문에 이러한 문제가 있습니다. 
하지만 이 문제는 HTTP/2 에서 바이너리 프레이밍 메커니즘이 도입되면서 해소되었습니다.


## HTTP/2

2009년에 구글에서 개발한 시험용 프로토콜인 SPDY가 발표되었습니다. 
HTTP/1.1 의 성능 제한을 해결하여 웹페이지 로드 지연시간을 줄이는 것이 목표였습니다.  
SPDY가 점차 사용되는 곳이 많아지면서 HTTP-WG는 이를 발판으로 더 나은 프로토콜을 빌드하여 개선했습니다.
그렇게 2015년 5월 RFC 7540(HTTP/2)가 발행되었습니다.

### 바이너리 프레이밍 계층

{% include image.html alt="바이너리 프레이밍 계층(출처: 구글)" path="images/theory/http-version-point/binary-framing.png" %}

HTTP/2 에서 성능 향상 중 가장 핵심은 새로운 바이너리 프레이밍 계층입니다. 
메시지가 캡슐화되어 클라이언트와 서버 사이에 전송되는 방식을 규정합니다.  

클라이언트와 서버는 새 바이너리 인코딩 메커니즘을 사용해야 합니다. 
그러므로 HTTP/1.x 클라이언트는 HTTP/2 전용 서버를 이해하지 못합니다. 

### 스트림, 메시지, 프레임

{% include image.html alt="스트림 메시지 프레임 (출처: 구글)" path="images/theory/http-version-point/stream-message-frame.png" %}

바이너리 프레이밍 메커니즘이 도입되어 데이터 교환 방식이 변경되었습니다. 

- 스트림 : 구성된 연결 내에서 전달되는 양방향 흐름, 하나 이상의 메세지가 존재 가능합니다.
  - 모든 통신은 단일 TCP 연결에서 수행됩니다.
  - 전달될 수 있는 양방향 스트림의 수는 제한이 없습니다.
  - 각 스트림에는 메시지 전달에 사용되는 고유 식별자와 우선순위 정보가 있습니다.

- 메시지 : 논리적 요청 또는 응답 메시지에 매핑되는 프레임의 전체 시퀀스입니다.
  - 각 메시지는 하나의 논리적 HTTP 메시지입니다.
  - 메시지는 하나 이상의 프레임으로 구성됩니다.

- 프레임 : HTTP/2 통신의 최소 단위. 프레임 헤더가 포함되며, 최소한으로 프레임이 속하는 스트림을 식별합니다. 
  - 다른 스트림들의 프레임을 끼워넣을 있으며, 스트림 식별자를 통해 다시 조립할 수 있습니다.


### 요청 및 응답 다중화

{% include image.html alt="HTTP 2.0 통신 (출처: 구글)" path="images/theory/http-version-point/http2-connection.png" %}

HTTP/1.x의 경우 병렬 요청을 수행하려면 여러 TCP 연결이 필요합니다. 
연결당 하나의 응답만 전달되고 Head-of-Line 차단이 발생됩니다. 
TCP 연결의 비효율적인 사용이 초래됩니다.

HTTP/2의 경우 바이너리 프레이밍 계층의 도입으로 위와 같은 제한을 개선했고 
전체 요청 및 응답 다중화를 지원합니다.
HTTP 메시지를 독립된 프레임으로 세분화하고, 인터리빙한 다음, 다른 쪽에서 다시 조립하도록 허용합니다.

- 여러 요청과 응답을 차단하지 않고 병렬로 인터리빙할 수 있습니다.
- 단일 연결로 요청과 응답을 병렬로 전달이 가능합니다.
- 연결된 파일, 이미지 스프라이트, 도메인 분할 같은 불필요한 HTTP/1.x 임시 방편을 제거합니다.
- 불필요한 지연 시간을 제거하고 네트워크 용량 활용도를 개선하여 페이지 로드 시간을 줄입니다.

### 스트림 우선순위 지정

{% include image.html alt="스트림 우선순위 (출처: 구글)" path="images/theory/http-version-point/stream-priority.png" %}

프레임이 인터리빙되면서 전달되는 순서도 중요해졌습니다. 
그래서 HTTP/2 에서는 각 스트림이 연관된 가중치와 종속성이 갖도록 되었습니다.

- 각 스트림은 1~256 사이의 정수 가중치가 할당될 수 있습니다.
- 다른 스트림에 대한 명시적 종속성 부여가 가능합니다.
- 종속성과 가중치 조합을 통해서 클라이언트가 '우선순위 지정 트리'를 구성하고 통신할 수 있습니다.
- 서버가 CPU, 메모리 및 기타 리소스의 할당을 제어하여 스트림 처리의 우선순위를 지정합니다.
- 우선순위가 높은 응답이 클라이언트에게 최적으로 전달되도록 대역폭을 할당합니다.

#### 종속성  
- 스트림 종속성은 다른 스트림의 고유 식별자를 상위 요소로 참조하는 방식으로 선언됩니다. 
- 고유 식별자가 생략되면 '루트 스트림'에 종속됩니다.
- 상위 요소 스트림에 종속성보다 리소스가 먼저 할당되어야 합니다. (C보다 D 먼저 처리)

#### 가중치
- 상위 요소를 공유하는 스트림은 가중치에 비례하여 리소스가 할당됩니다. (A는 3/4, B는 1/4 수신)


### 출처당 하나의 연결

- 모든 HTTP/2 연결은 영구적이고 출처당 하나의 연결만 필요합니다.
- 동일한 연결을 재사용하여 TCP 연결을 효율적으로 사용합니다.
- 전반적인 프로토콜 오버헤드를 대폭 줄일 수 있습니다.
- 적은 연결로 메모리와 처리량이 감소됩니다. (운영 비용 절감, 네트워크 활용도와 용량 개선)


### 흐름 제어

HTTP/2는 TCP 연결내에서 다중화 되기 때문에 흐름제어가 정교하지 못하며, 
개별 스트림의 전달을 제어하는데 필요한 애플리케이션 수준 API 제공하지 못합니다.  

이 문제를 해결하기 위해 HTTP/2 단순한 빌딩 블록 세트를 제공하여, 
스트림 수준과 연결 수준에서 흐름 제어를 구현할 수 있습니다.

- 흐름 제어는 크레딧 기반입니다. 각 수신기는 자체의 초기 연결과 스트림 흐름제어 창을 알립니다.
- 비활성화 될 수 없습니다. 연결이 구성되면 `SETTINGS` 프레임을 교환합니다.
- 흐름 제어는 종단간 방식이 아닌 홉 방식입니다. 중개자가 자체적인 기준과 추론에 따라 리소스를 제어하고 할당 메커니즘 구현이 가능합니다.

### 서버 푸시

{% include image.html alt="서버 푸시 (출처: 구글)" path="images/theory/http-version-point/server-push.png" %}

HTTP/2 에서는 클라이언트가 요청하지 않아도 서버가 추가적인 리소스를 보낼 수 있습니다. 

일반적인 웹 애플리케이션은 여러 개의 리소스로 구성됩니다. 
리소스들은 클라이언트에 의해 검색되고 서버가 검사하게 되는데 
서버 푸시를 사용하면 이 지연시간을 줄일 수 있습니다.

데이터 URI를 통해 [리소스 인라인 처리](https://hpbn.co/http1x/#resource-inlining) 를 사용해봤다면 
서버 푸시를 사용해본 것입니다.

푸시 리소스의 경우 다음과 같습니다.
- 클라이언트에 의해 캐시
- 다른 페이지에서 재사용
- 다른 리소스와 함께 다중화
- 서버에서 우선 순위 지정
- 클라리언트에 의한 거부


### 헤더 압축 ([IETF HPACK - HTTP/2의 헤더 압축](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-header-compression))

{% include image.html alt="헤더 압축 (출처: 구글)" path="images/theory/http-version-point/header-compression.png" %}

HTTP 전송에서는 리소스와 속성을 설명하는 헤더 세트를 전달하게 됩니다. 
HTTP/1.x 에서는 일반 텍스트로 전송되고, 전송당 500~800바이트의 오버헤드가 추가됩니다. ([프로토콜 오버헤드](https://hpbn.co/http1x/#measuring-and-controlling-protocol-overhead)) 

HTTP/2 에서는 이 오버헤드를 줄이고 성능을 개선하기 위해 HPACK 압축 형식을 사용하여 헤더 메타데이터를 압축합니다. 
압축 형식에는 다음 두 기술을 사용합니다.
- 전송되는 헤더 필드를 정적 Huffman 코드로 인코딩 합니다. 
  - 개별 전송 크기를 줄여줍니다.
- 이전에 표시된 헤더 필드의 색인 목록을 서버와 클라이언트가 유지하고 업데이트하도록 요구합니다.
  - 이전에 전송된 값을 효육적으로 인코딩합니다.

HPACK 압축 컨텍스트는 정적 및 동적 테이블로 구성됩니다.
- 정적 테이블
  - 사양에 정의됩니다. 
  - 모든 연결에 사용될 가능성이 있는 공용 HTTP 헤더 필드를 제공합니다.
- 동적 테이블
  - 처음에는 비어있습니다.
  - 특정 연결에서 교환되는 값에 따라 업데이트 됩니다.

## HTTP/3

{% include image.html alt="http2 vs http3 (출처: 위키피디아)" path="images/theory/http-version-point/http2-vs-http3.svg" %}

HTTP/3는 HTTP의 3번째 메이저 버전으로  2015년에 HTTP/2 가 발표된지 4년만에 나왔습니다. ([rfc9000](https://datatracker.ietf.org/doc/html/rfc9000))
기존의 HTTP 와 가장 큰 차이점은 `TCP` 가 아닌 `UDP` 기반의 `QUIC`을 이용하여 통신을 합니다.

`QUIC`은 Quick UDP Internet Connection 의 약자로 전송 프로토콜인 UDP 기반으로 동작합니다. 
클라이언트와 서버의 연결 수를 줄이고 대역폭을 에상해서 패킷 혼잡을 피한다는 것이 주요 특징입니다.


### 연결 지연

{% include image.html alt="RTT 비교 (출처: [구글 클라우드 플랫폼 블로그](https://cloudplatform.googleblog.com/2018/06/Introducing-QUIC-support-for-HTTPS-load-balancing.html))" path="images/theory/http-version-point/rtt-comparison.gif" %}

RTT(Round Trip Time)는 패킷이 목적지에 도달하고 응답이 돌아오기까지의 시간, 즉 패킷 왕복 시간을 의미합니다. 

HTTP + TLS + TCP 에서 TCP는 서버와 클라이언트 연결을 설정하기 위해서 핸드쉐이크가 필요하고 
TLS 사용한 보안 설정을 위해 자체 핸드쉐이크가 필요하기 때문에 총 3 RTT가 필요합니다.

반면, `QUIC` 은 보안 세션 설정을하기 위해 단일 핸드쉐이크(1 RTT)만 필요합니다. 
이것이 가능한 이유는 첫번째 핸드셰이크가 이뤄질 때, 연결 설정과 함께 데이터를 보내기 때문입니다. 
TCP + TLS 에서는 연결과 암호화에 필요한 정보를 교환하고 유효성을 검사한 뒤에 데이터를 교환하지만 
QUIC 에서는 세션 키를 교환하기도 전에 데이터를 교환하게 됩니다.

한번 연결에 성공했다면 서버는 그 설정을 캐싱하고 있습니다. 
다음 연결부터는 이 캐싱된 설정을 이용해서 연결이 되기 때문에 0 RTT 만으로도 통신을 할 수 있습니다. 
`QUIC` 핸드쉐이크에 대해 더 자세히 알고 싶다면 [Rovert Lychv 발표](https://www.youtube.com/watch?v=vXgbPZ-1-us)를 참고해주세요.




## 참조
- https://ko.wikipedia.org/wiki/HTTP
- https://kyun2da.dev/CS/http%EC%9D%98-%EC%97%AD%EC%82%AC%EC%99%80-http2%EC%9D%98-%EB%93%B1%EC%9E%A5/
- https://developers.google.com/web/fundamentals/performance/http2?hl=ko#%EC%8A%A4%ED%8A%B8%EB%A6%BC_%EB%A9%94%EC%8B%9C%EC%A7%80_%EB%B0%8F_%ED%94%84%EB%A0%88%EC%9E%84
- https://hpbn.co/brief-history-of-http
- https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP
- https://developer.mozilla.org/ko/docs/Web/HTTP/Connection_management_in_HTTP_1.x
- https://m.blog.naver.com/sehyunfa/221680799006
- https://velog.io/@ziyoonee/HTTP1-%EB%B6%80%ED%84%B0-HTTP3-%EA%B9%8C%EC%A7%80-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0
- https://evan-moon.github.io/2019/10/08/what-is-http3/
- https://blog.cloudflare.com/ko-kr/http3-the-past-present-and-future-ko-kr/
- https://http3-explained.haxx.se/ko/the-protocol/feature-http
- https://medium.com/codavel-blog/quic-vs-tcp-tls-and-why-quic-is-not-the-next-big-thing-d4ef59143efd
- https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/46403.pdf
