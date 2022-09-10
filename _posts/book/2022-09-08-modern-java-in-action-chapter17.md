---
title: '[Modern Java in Action] Chapter17. 리액티브 프로그래밍'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 17장에서는 리액티브 프로그래밍에 대해 소개하고 있다.  
리액티브 프로그래밍이란 무엇인지 어떻게 동작하는지 자세히 알아본다.  

<!--more-->

<br/>

## 17.1 리액티브 매니패스토

리액티브 애플리케이션과 시스템 개발의 핵심 원칙

- 반응성(responsive)
  - 리액티브 시스템은 빠르고 일정하고 예상할 수 있는 반응 시간을 제공하여 사용자 기대치를 가질 수 있음
- 회복성(resilient)
  - 컴포넌트 실행 복제, 여러 컴포넌트의 시간과 공간 분리, 비동기적으로 작업을 다른 컴포넌트에 위임 등 회복성을 위한 다양한 기법 제공
- 탄력성(elastic)
  - 무서운 작업 부하가 발생되면 자동으로 관련 컴포넌트에 할당된 자원 수를 늘림
- 메시지 주도(Message-driven)
  - 비동기 메시지를 전달해 컴포넌트 끼리의 통신이 이루어짐(컴포넌트의 경계가 명확해져 회복성과 탄력성 지원)

### 애플리케이션 수준의 리액티브

리액티브 프로그래밍은 비동기로 작업을 수행하는 것이 주요 기능이다.  
리액티브 프레임워크와 라이브러리는 스레드를 퓨처, 액터, 콜백을 발생시키는 이벤트 루프 등과 처리할 이벤트를 변환하고 관리하여 CPU 사용률을 극대화할 수 있다.  

이 기술을 이용하여 동기, 비동기 애플리케이션 구현의 추상 수준을 높일 수 있다.  
그래서 멀티스레드 문제를 직접 처리하지 않아도 되기 때문에 비즈니스 요구사항에 집중할 수 있다.  
 
### 시스템 수준의 리액티브

리액티브 시스템은 일관적인, 회복할 수 있는 플랫폼을 구성할 수 있게 도와주는 소프트웨어 아키텍처다.  

- 리액티브 애플리케이션
  - 비교적 짧은 시간 동안 유지되는 데이터 스트림에 기반한 연산 수행
  - 이벤트 주도
- 리액티브 시스템
  - 애플리케이션을 조립하고 상호소통 조절
  - 메시지 주도
    - 회복성: 컴포넌트에서 장애를 고립시켜 제공 (결함 허용 능력, fault-tolerance)
    - 탄력성: 위치 투명성, 컴포넌트가 수신자의 위치에 상관없이 다른 서비스와 통신 가능 (확장 가능)

<br/>

## 17.2 리액티브 스트림과 플로 API

리액티브 프로그래밍은 리액티브 스트림을 사용하는 프로그래밍이다.  
리액티브 스트림은 블록하지 않는 역압력을 전제하여 비동기 데이터를 순서대로 처리하는 표준 기술이다.   

역압력은 이벤트가 제공되는 속도보다 느린 속도로 소비되면서 문제가 발생되지 않도록 보장하는 장치다.  
부하가 발생한 컴포넌트는 다음 정보들을 업스트림 발행자에게 알릴 수 있어야 한다.
- 이벤트 발생 속도를 늦추라는 알림
- 수신할 수 있는 이벤트의 양
- 기존 데이터를 처리하는데 걸리는 시간


### Flow 클래스 소개

[리액티브 스트림 프로젝트](https://www.reactive-streams.org)에서는 리액티브 스트림이 제공해야 하는 최소 기능 집합을 네 개의 관련 인터페이스로 정의했다.

- Publisher
  - 항목 발행(이벤트 제공)
- Subscriber
  - 발행된 항목을 한 개씩 또는 여러 항목 소비
  - 자신을 이벤트의 리스너로 등록 가능
- Subscription
  - 소비되는 과정을 관리 (Publisher 와 Subscriber 사이의 제어 흐름, 역압력 관리)
- Processor
  - Publisher, Subscriber 상속 
  - Publisher 를 구독하고 수신한 데이터를 가공해 다시 제공

```java 
@FunctionalInterface
public interface Publisher<T> {
    void subscribe(Subscriber<? super T> s);
}

public interface Subscriber<T> {
    void onSubscribe(Subscription s);  // 처음 호출
    void onNext(T t);                  // 여러번 호출 가능
    void onError(Throwable t);         // 장애 발생된 경우 호출
    void onComplete();                 // 더 이상의 데이터가 없고 종료됨
}
//  이벤트들은 다음 순서대로 메소드를 호출하여 발행되어야 한다.
//  onSubscribe onNext* (onError | onComplete)?

public interface Subscription {
    void request(long n);              // 정의된 개수의 이하의 요소만 전달 가능  
    void cancel();                     // 종료 시그널
} 

public interface Processor<T, R> extends Subscriber<T>, Publisher<R> { }
```


{% include image.html alt="리액티브 애플리케이션의 생명주기" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/flow-api-sequence.png" %}


### 첫번째 리액티브 애플리케이션 만들기

리액티브 애플리케이션을 개발하면서 네 개의 인터페이스가 어떻게 동작하는지 확인한다. 

- TempInfo: 원격 온도계를 흉내
- TempSubscriber: 레포트를 관찰하면서 각 도시에 설치된 센서에서 보고한 온도 스트림 출력

```java 
public class Main {

    public static void main(String[] args) {
        celsiusTemperatures("new York").subscribe(new TempSubscriber());
    }

    private static Flow.Publisher<TempInfo> celsiusTemperatures(String town) {
        return subscriber -> {
            TempProcessor processor = new TempProcessor();
            processor.subscribe(subscriber);
            processor.onSubscribe(new TempSubscription(processor, town));
        };
    }
}

// 보고된 온도를 전달
public class TempInfo {

    private static final Random random = new Random();

    private final String town;
    private final int temp;

    public TempInfo(String town, int temp) {
        this.town = town;
        this.temp = temp;
    }

    public static TempInfo fetch(String town) {
        // 10분의 1확률로 온도 조회 실패
        if (random.nextInt(10) == 0) {
            throw new RuntimeException("error");
        }
        return new TempInfo(town, random.nextInt(100));
    }

    public String town() {
        return town;
    }

    public int temp() {
        return temp;
    }

    @Override
    public String toString() {
        return String.join(" : ", town, String.valueOf(temp));
    }
}


// 전달한 온도를 출력하고 새 레포트 요청
public class TempSubscriber implements Flow.Subscriber<TempInfo> {

    private Flow.Subscription subscription;

    @Override
    public void onSubscribe(Flow.Subscription subscription) {
        this.subscription = subscription;
        subscription.request(1);
    }

    @Override
    public void onNext(TempInfo tempInfo) {
        System.out.println(tempInfo);
        subscription.request(1);
    }

    @Override
    public void onError(Throwable throwable) {
        System.out.println(throwable.getMessage());
    }

    @Override
    public void onComplete() {
        System.out.println("Done");
    }
}



// 도시의 온도 전송
public class TempSubscription implements Flow.Subscription {

    // 재귀호출을 하기 때문에 StackOverflowError 방지를 위해 사용
    private static final ExecutorService executor = Executors.newSingleThreadExecutor();

    private final Flow.Subscriber<? super TempInfo> subscriber;
    private final String town;

    public TempSubscription(Flow.Subscriber<? super TempInfo> subscriber, String town) {
        this.subscriber = subscriber;
        this.town = town;
    }

    @Override
    public void request(long n) {
        executor.submit(() -> {
            for (int i = 0; i < n; i++) {
                try {
                    subscriber.onNext(TempInfo.fetch(town));
                } catch (Exception e) {
                    subscriber.onError(e);
                    break;
                }
            }
        });
    }

    @Override
    public void cancel() {
        subscriber.onComplete();
    }
}



// 화씨로 제공된 데이터를 섭씨로 변환해 다시 방출
public class TempProcessor implements Flow.Processor<TempInfo, TempInfo> {

    private Flow.Subscriber<? super TempInfo> subscriber;

    @Override
    public void subscribe(Flow.Subscriber<? super TempInfo> subscriber) {
        this.subscriber = subscriber;
    }

    @Override
    public void onNext(TempInfo temp) {
        subscriber.onNext(new TempInfo(temp.town(),
                (temp.temp() - 32) * 5 / 9));
    }

    @Override
    public void onSubscribe(Flow.Subscription subscription) {
        subscriber.onSubscribe(subscription);
    }

    @Override
    public void onError(Throwable throwable) {
        subscriber.onError(throwable);
    }

    @Override
    public void onComplete() {
        subscriber.onComplete();
    }
}
```

