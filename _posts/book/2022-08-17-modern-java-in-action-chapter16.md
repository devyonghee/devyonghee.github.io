---
title: '[Modern Java in Action] Chapter16. CompletableFuture: 안정적 비동기 프로그래밍'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 16장에서는 비동기 프로그래밍에 대해 소개하고 있다.     
실용적인 예제를 통해 `CompletableFuture`이 얼마나 비동기 프로그램에 유용하게 사용되는지 알아본다. 

<!--more-->

<br/>

## 16.1 Future 의 단순 활용

`Future`는 저수준 스레드에 비해 직관적으로 이해하기 쉽다.  
`Future`를 이용하기 위해서는 `Callable` 객체 내부로 감싸고 `ExecutorService` 에 제출해야 한다.

```java 
ExecutorService executor = Executors.newCachedThreadPool();
Future<Double> future = executor.submit(new Callable<Double>() {
    public Double call() {
        // 시간이 오래걸리는 작업은 다른 스레드에서 비동기로 실행
        return doSomeLongComputation();
    }
});

doSomethingElse(); // 비동기 작업을 수행하는 동안 다른 작업 실행

try {
    // 오랜 시간 블락될 수 있으므로 최대 1초 동안 비동기 작업 결과를 가져옴
    Double result = future.get(1, TimeUnit.SECONDS);  
} catch (ExecutionException ee) {
    // 계산 중 예외 발생
} catch (InterruptedException ie) {
    // 현재 스레드에서 대기 중 인터럽트 발생
} catch (ExecutionException ee) {
    // Future가 완료되기 전에 타임아웃 발생
}
```

### Future 제한

`Future` 만으로 간결한 동시 실행 코드를 구현하는 것은 쉽지 않다.  
다음과 같은 선언형 기능들이 있다면 유용할 것이다.  

- 두 개의 비동기 계산 결과를 하나로 합친다.
  - 두 가지 계산 결과는 서로 독립적일 수 있음
  - 두 번째 결과가 첫 번째 결과에 의존하는 상황일 수 있음
- Future 집합이 실행하는 모든 태스크의 완료를 기다린다.
- Future 집합에서 가장 빨리 완료되는 태스크를 기다렸다가 결과를 얻는다.
- 프로그램적으로 Future 를 완료시킨다. (비동기 동작에 수동으로 결과 제공)
- Future 완료 동작에 반응한다. 
  - 결과를 기다리면서 블록되지 않고 결과가 준비되었다는 알림을 받고 추가 동작 수행

이러한 기능을 선언형으로 사용할 수 있도록 `CompletableFuture` 를 살펴본다.  
`Stream`과 비슷한 패턴으로 람다 표현식과 파이프라이닝을 활용한다. 

> ### 동기 API 와 비동기 API
> 동기 API: 메서드를 호출하고 계산이 완료될 때까지 기다렸다가 다른 동작 수행 (블록 호출)  
> 비동기 API: 메서드가 즉시 반환되며 나머지 작업을 호출자 스레드와 동기적으로 실행될 수 있도록 다른 스레드에 할당 (비블록 호출)


<br/>

## 16.2 비동기 API 구현

최저가격 검색 애플리케이션 구현하기 위해, 각 상점에서 제공해야 하는 API 부터 정의한다.
가격을 조회할 때는 상점의 데이터베이스와 함께 외부 서비스를 이용한다고 가정하여 1초가 지연된다고 생각한다.  
이러한 동기 메서드를 사용자가 편리하게 이용할 수 있도록 비동기 API 를 만들기로 결정했다고 가정한다. 

```java 
public class Shop {
    public double getPrice(String product) {
        return calculatePirce(product);
    }
    
    public double calculatePrice(String product) {
        delay();
        return random.nextDouble() * product.charAt(0) + product.charAt(1);
    }
} 

publid static void delay() {
    try {
        Thread.sleep(1000L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}
```


### 동기 메서드를 비동기 메서드로 변환

비동기 메서드로 변환할 것이므로 메서드명을 `getPriceAsync`로 변경한다.  
`CompletableFuture` 클래스를 이용하여 이 메서드를 쉽게 구현한다.

```java 
public Future<Double> getPriceAsync(String product) {
    CompletableFuture<Double> futurePrice = new CompletableFuture<>();
    new Thread(() -> {
                // 다른 스레드에서 비동기적으로 수행
                double price = calculatePrice(product);
                // 오랜 시간이 걸리는 계산이 완료되면 Future 에 값을 설정
                futurePrice.complte(price);
    }).start();
    // 계산 결과가 완료되길 기다리지 않고 바로 반환
    return futurePrice;
}

// 사용 코드
Shop shop = new Shop("BestShop");
long start = System.nanoTime();
                             // 즉시 Future 반환
Future<Double> futurePrice = shop.getPriceAsync("my favorite product");

doSomethingElse();

try {
    // 값을 읽거나 계산될 때까지 블록 
    double price = futurePrice.get();
    System.out.printf("Price is %.2f%n", price);
} catch (Exception e) {
    throw new RuntimeException(e);
}
```


### 에러 처리 방법

게산하는 동안 에러가 발생했을 경우 `get` 메서드가 반환될 때까지 계속 기다리게 될 수 있다.  
이처럼 블록 문제가 발생할 수 있는 상황에서는 타임아웃을 활용하는 것이 좋다.  
그래야 영원히 블록되지 않고 타임아웃 시간이 지나면 `TimeoutException`을 받을 수 있다.  

계산 도중에 발생된 에러에 대해 알기 위해서는 `completeExceptionally` 메서드를 이용한다. 

```java 
public Future<Double> getPriceAsync(String product) {
    CompletableFuture<Double> futurePrice = new CompletableFuture<>();
    new Thread(() -> {
                try {
                    double price = calculatePrice(product);
                    futurePrice.complte(price);
                } catch (Exception ex) {
                    // 에러가 발생하면 발생한 에러를 포함시켜 Future 종료
                    futurePirce.completeExceptionally(ex);
                }
    }).start();
    return futurePrice;
}
```

### 팩토리 메서드 supplyAsync 로 CompletableFuture 만들기 

`CompletableFuture` 직접 생성하지 않고 더 간단한게 만드는 방법이 있다.  
`supplyAsync` 메서드는 `Supplier` 를 인수로 받아 `CompletableFuture`을 반환한다.  
그러면 `ForkJoinPool` 의 `Excutor` 중 하나가 `Supplier`을 실행하게 될텐데 두번째 인자에 `Excutor`을 추가하면 직접 지정할 수도 있다.   

```java 
public Future<Double> getPriceAsync(String product) {
    return CompletableFuture.supplyAsync(() -> calculatePrice(product));
}
```

<br/>

## 16.3 비블록 코드 만들기

예제로 상점 리스트에서 제품명을 입력하면 상점 이름과 제품 가격 정보를 가져오는 메서드를 구현한다.  
그런데 가격을 검색하는 동안 각각 1초의 대기시간이 있어서 4초 이상의 시간이 걸린다고 가정한다.  
성능을 개선하는 방법을 알아보자

```java 
List<Shop> shops = Arrays.asList(new Shop("BestPrice"), 
                                 new Shop("LetsSaveBig"),
                                 new Shop("MyFavoriteShop"),
                                 new Shop("BuyItAll"));

public List<String> findPrices(String product) {
    return shops.stream()
        .map(shop -> String.format("%s price is %.2f", shop.name(), shop.price(product)))
        .collect(toList());
}
```


### 병렬 스트림으로 요청 병렬화하기 

병렬 스트림을 이용하여 순차 계산을 병렬로 처리해서 성능을 개선해본다.  
아래와 같이 변경하면 병렬로 검색되므로 1초 남짓의 시간에 완료된다. 

```java 
public List<String> findPrices(String product) {
    return shops.parallelStream()
        .map(shop -> String.format("%s price is %.2f", shop.name(), shop.price(product)))
        .collect(toList());
}
```


### CompletableFuture 로 비동기 호출 구현하기

팩토리 메서드 `supplyAsync` 로 `CompletableFuture`을 생성하여 구현해본다.  
스트림 연산은 게으른 특성이 있기 때문에 하나의 스트림 처리 파이프라인으로 처리하면 연산이 동기적, 순차적으로 이루어진다.  
그러므로 두 개의 스트림 파이프라인으로 처리가 필요하다. 

```java 
public List<String> findPrices(String product) {
    List<CompletableFuture<String>> priceFutures = 
        shops.stream()
        .map(shop -> CompletableFuture.supplyAsync(
            () -> String.format("%s price is %.2f", shop.name(), shop.price(product))
        )).collect(toList());
        
    return priceFutures.stream()
            .map(CompletableFuture::join)
            .collect(toList());
}    
```


### 더 확장성이 좋은 해결방법

모든 스레드(일반적으로 스레드풀에서 제공하는 스레드 수는 4개)가 사용된 상황에서 다섯번 째 상점을 추가하면 추가로 1초 이상의 시간이 소요된다.  
병렬 스트림과 `CompletableFuture` 버전은 소요되는 시간은 비슷하다.  
두 가지 모두 내부적으로 `Runtime.getRuntime().availableProcessors()` 가 반환하는 스레드 수를 사용하기 때문이다.  

하지만 `CompletableFuture`는 작업에 이용할 수 있는 다양한 `Executor`를 지정할 수 있다는 장점이 있다.  
`Executor`로 스레드 풀의 크기를 조절하는 등 애플리케이션에 맞는 최적화된 설정을 만들 수 있다. 


### 커스텀 Executor 사용하기

상점의 응답은 대략 99퍼센트의 시간만큼 기다리므로 W/C 비율을 100으로 간주한다.  
CPU 활용률이 100퍼센트라면 400스레드를 갖는 풀을 만들어야 한다.
하지만 상점 수보다 많은 스레드를 갖는 것은 낭비이므로 상점에 하나의 스레드가 할당될 수 있도록, 상점 수 만큼 `Executor`을 설정한다.  
하나의 스레드의 최대 개수는 100 이하로 설정하는 것이 바람직하다.  

자바에서 일반 스레드가 실행중이면 자바 프로그램이 종료되지 않는다.  
그래서 자바 프로그램이 종료될 때 강제로 실행이 종료될 수 있도록 데몬 스레드를 포함한다.

```java 
private final Executor executor = 
    Executors.newFixedThreadPool(Math.min(shops.size(), 100), 
                                 new ThreadFactory() {
                                     public Thread newThread(Runnable r) {
                                         Thread t = new Thread(r);
                                         // 프로그램 종료를 방해하지 않는 데몬 스레드 사용
                                         t.setDaemon(true);
                                         return t;
                                     }
                                 });
                                 
CompletableFuture.supplyAsync(
    () -> String.format("%s price is %.2f", shop.name(), shop.price(product),
    executor
);                                
```

> ### 스레드 풀 크기 조절  
> '자바 병렬 프로그래밍' 에서 스레드 풀의 최적값을 찾는 방법을 제안한다. 
> 스레드 풀이 너무 크면 CPU 와 메모리 자원이 서로 경쟁하느라 시간을 낭비할 수 있고  
> 너무 작으면 CPU의 일부 코어는 활용되지 않을 수 있다.   
> N(threads) = N(CPU) * U(CPU) * (1 + W/C)   
> N(CPU): Runtime.getRunTime().availableProcessors() 가 반환하는 코어 수  
> U(CPU): 0 과 1 사이의 값을 갖는 CPU 활용 비율  
> W/C : 대기 시간과 계산 시간의 비율


### 스트림 병렬화와 CompletableFuture 병렬화

다음을 참고하여 두 가지 기법 중 어떤 병렬화 기법을 사용할 것인지 선택한다.  

- I/O 가 포함되지 않은 계산 중심의 동작을 실행할 때는 스트림 인터페이스가 구현하기 간단하며 효율적일 수 있다. 
  - 모든 스레드가 계산 작업을 수행하는 상황에서는 프로세서 코어 수 이상의 스레드를 가질 필요가 없다.
- I/O를 기다리는 작업을 병렬로 실행할 때는 `CompletableFuture`이 더 많은 유연성을 제공하며 W/C 비율에 적합한 스레드 수를 설정할 수 있다.
  - 스트림의 게으른 특성 때문에 스트림에서 I/O 를 실제 언제 처리할지 예측하기 어렵다. 


<br/>

## 16.4 비동기 작업 파이프라인 만들기

모든 상점이 하나의 할인 서비스를 사용하기로 했다고 가정한다. 

```java 
public class Discount {
    public enum Code {
        NONE(0), SILVER(5), GOLD(10), PLATINUM(15), DIAMOND(20);
        
        private final int percentage;
        
        Code(int percentage) {
            this.percentage = percentage;
        }
    }
}

publid String getPrice(String product) {
    double price = calcaulatePrice(product);
    Discount.Code code = Discount.Code.values()[
                           random.nextInt(Discount.Code.values().lenth)];
    return String.format("%s:%.2f:%s", name, price, code);
}

private double calculatePrice(String product) {
    delay();
    return random.nextDouble() * product.charAt(0) + product.charAt(1);
}
```

### 할인 서비스 구현

최저가격 검색 애플리케이션은 여러 상점에서 가격 정보 조회, 결과 문자열 파싱, 할인 서버에 질의를 요청한다.  
문자열 파싱은 다음처럼 `Quote` 클래스로 캡슐화할 수 있고, 
이를 이용하여 할인된 가격 문자열을 반환하는 `Discount` 를 제공할 수 있다. 

```java 
public class Quote {
    private final String shopName;
    private final double price;
    private final Discount.Code discountCode;
    
    public Quote(String shopName, double price, Discount.Code code) {
        this.shopName = shopName;
        this.price = price;
        this.discountCode = code;
    }
    
    public static Quote parse(String s) {
        String[] split = s.split(":");
        String shopName = split[0];
        double price = Double.parseDouble(split[1]);
        Discount.Code discountCode = Discount.Code.valueOf(split[2]);
        return new Quote(shopName, price, discountCode);
    }
    
    public String shopName() {
        return shopName; 
    }
    public double price() {
        return price; 
    }
    public Discount.Code discountCode() {
        return discountCode; 
    }
}

public class Discount {
    public enum Code {
        // ...
    }
    
    public static String applyDiscount(Quote quote) {
        return quote.shopName() + " price is " + 
            Discount.apply(quote.price(), quote.discountCode());
    }
    
    private static double apply(double price, Code code) {
        delay();
        return format(price * (100 - code.percentage) / 100);
    }
}
```

### 할인 서비스 사용

순차적과 동기 방식으로 `findPrices` 메서드를 구현한다.   
아래와 같이 사용하면 가격 정보 조회 5초, 할인 서비스 5초가 소요되어 총 10초 정도 소요된다.  
`CompletableFuture` 에 커스텀 `Executor` 를 정의하여 수행하는 태스크를 설정하도록 한다.  

```java 
public List<String> findPrices(String product) {
    return shops.stream()
             .map(shop -> shop.price(product))
             .map(Quote::parse)
             .map(Discount::appplyDiscount)
             .collect(toList());
}
```

### 동기 작업과 비동기 작업 조합하기 

위의 코드를 비동기로 재구현한다. 

```java 
public List<String> findPrices(String product) {
    List<CompletableFuture<String>> priceFutures = 
        shops.stream()
             .map(shop -> CompletableFuture.supplyAsync(
                              () -> shop.price(product), executor))
             .map(future -> future.thenApply(Quote::parse))
             .map(future -> future.thenCompose(quote -> 
                            CompletableFuture.supplyAsync(
                                () -> Discount.applyDiscount(quetoe), executor)))
             .collect(toList());
    
    return priceFutures.stream()
             .map(CompletableFuture::join)
             .collect(toList());
}
```

- 가격 정보 얻기
  - `supplyAsync` 에 람다 표현식을 전달하여 비동기적으로 가격 정보 조회
- `Quote` 파싱하기 
  - 파싱동작에는 원격서비스나 I/O 가 없으므로 지연 없이 즉시 동작 수행
  - `thenApply` 메서드는 `CompletableFuture` 가 끝날 때까지 블록하지 않음
- `CompletableFuture`를 조합해서 할인된 가격 계산
  - 가격 정보 조회하여 파싱, 할인된 최종가격 확인 두 비동기 연산을 파이프라인으로 만들 수 있도록 `thenCompose` 메서드 사용

### 독립 CompletableFuture 와 비독립 CompletableFuture 합치기

첫 번째 `CompletableFuture` 의 동작 완료와 관계 없이 두 번째 `CompletableFuture`을 실행하려면 `thenCombine` 메서드를 사용한다.   
`thenCombine` 메서드는 `BiFunction` 을 두 번째 인수로 받는다. 

```java 
Future<Double> futurePriceInUSD = 
        CompletableFuture.supplyAsync(() -> shop.price(product))
        .thenCombine(
            CompletableFuture.supplyAsync(
                () -> exchangeService.getRate(Money.EUR, Money.USD)),
            (price, rate) -> price * rate
        ));
```


### Future 의 리플렉션과 CompletableFuture 의 리플렉션

`CompletableFuture` 은 람다 표현식을 이용하기 때문에 복잡한 연산 수행을 효과적으로 정의할 수 있다.  
`Future` 로 구현한 코드를 보면서 가독성을 비교해본다.  

```java 
ExecutorService executor = Exeutors.newCachedThreadPool();
fina Future<Double> futureRate = executor.submit(new Callable<Double>() {
    public Double call() {
        return exchangeService.getRate(Money.EUR, Money.USD);
    }
});
Future<Double> futurePriceInUSD = executor.submit(new Callable<Double>() {
    public Double call() {
        double priceInEUR = shop.price(product);
        return priceInEUR * futureRate.get();
    }
});
```

### 타임아웃 효과적으로 사용하기

`Future` 의 계산 결과를 읽을 때 무한정 기다리는 상황이 발생될 수 있으므로 블록하지 않는 것이 좋다.  
자바 9의 `CompletableFuture` 에서 제공하는 `orTimeout` 메서드로 이 문제를 해결할 수 있다.  
이 메서드는 지정된 시간이 지난 후에 `TimeoutException` 으로 완료하면서,
또 다른 `CompletableFuture` 를 반환할 수 있도록 `ScheduledThreadExector` 를 활용한다. 

```java 
Future<Double> futurePriceInUSD = 
    CompletableFuture.supplyAsync(() -> shop.price(product))
    .thenCombine(
        CompletableFuture.supplyAsync(
            () -> exchangeService.getRate(Money.EUR, Money.USD)),
        (price, rate) -> price * rate
    )).orTimeout(3, TimeUnit.SECONDS);
```

또한, 자바 9에 추가된 `completeOnTimeout` 메서드를 이용하면 시간이 지난 경우에 미리 정의한 기본 값을 활용할 수 있다.

```java 
Future<Double> futurePriceInUSD = 
    CompletableFuture.supplyAsync(() -> shop.price(product))
    .thenCombine(
        CompletableFuture.supplyAsync(
            () -> exchangeService.getRate(Money.EUR, Money.USD))
            .completeOnTimeout(DEFAULT_RATE, 1, TimeUnit.SECONDS),
        (price, rate) -> price * rate
    )).orTimeout(3, TimeUnit.SECONDS);
   
```

<br/>

## 16.5 CompletableFuture 의 종료에 대응하는 방법

상점마다 결과를 제공하는 시간이 각각 다를 수 있으므로 랜덤하게 시간이 지연되는 상황을 가정한다.  

```java 
private static final Random random = new Random();
public static void randomDelay() {
    int delay = 500 + random.nextInt(2000);
    try {
        Thread.sleep(delay);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
}
```


### 최저가격 검색 애플리케이션 리팩터링 

이제 모든 상점에서 가격 정보를 제공할 때까지 기다리지 않고 제공할 때마다 즉시 보여지도록 변경한다.  
연산 실행 정보를 추가하기 위해 스트림을 직접 제어해야 하므로 스트림을 반환한다.  

```java 
public Stream<CompletableFuture<String>> findPircesStream(String product) {
    return shops.stream()
             .map(shop -> CompletableFuture.supplyAsync(
                              () -> shop.price(product), executor))
             .map(future -> future.thenApply(Quote::parse))
             .map(future -> future.thenCompose(quote -> 
                    CompletableFuture.supplyAsync(() -> Discount.applyDiscount(quote), executor)));
}

// 사용 코드
findPricesStream("myPhone").map(f -> f.thenAccept(System.out::println));
```

계산이 끝나면 값을 소비하도록 `thenAccept` 메서드를 추가한다.  
`thenAcceptAsync` 도 있는데 이 메서드는 `CompletableFuture` 가 완료된 스레드가 아니라 새로운 스레드에서 실행한다.  
이 경우에는 즉시 응답해야 하므로 `thenAccept` 을 사용한다.

가장 느린 상점까지 응답을 받아 출력하고 싶다면 다음과 같이 배열로 추가하고 실행 결과를 기다려야 한다.

```java 
CompletableFuture[] futures = findPricesStream("myPhone")
    .map(f -> f.thenAccept(System.out::println))
    .toArray(size -> new CompletalbeFuture[size]);
     
CompletableFuture.allOf(futures).join();
```

만약, 하나의 작업이 끝나길 기다리는 상황이라면 `anyOf`를 사용한다.  
처음으로 완료된 값으로 동작을 완료한다. 

