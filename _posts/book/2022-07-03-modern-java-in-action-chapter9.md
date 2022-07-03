---
title: '[Modern Java in Action] Chapter9. 리팩터링, 테스팅, 디버깅'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 9장에서는 스트림과 람다 표현식 활용에 대해 소개한다.
스트림과 람다 표현식을 활용하여 리팩터링하고 테스트, 디버깅하는 방법에 대해 알아본다.

<!--more-->

<br/>

## 9.1 가독성과 유연성을 개선하는 리팩터링

스트림과 람다 표현식을 이용하여 가독성이 좋고 유연한 코드로 리팩터링 하는 방법에 대해 알아본다. 

### 익명 클래스를 람다 표현식으로 리팩터링

하나의 추상 메서드를 구현하는 익명 클래스는 람다 표현식으로 리팩터링이 가능하다.  

```java 
// 익명 클래스 이용
Runnable r1 = new Runnable() {
    public void run() {
        System.out.println("Hello");
    }
}
// 람다 표현식 이용
Runnable r2 = () -> System.out.println("Hello");
```

- 모든 익명 클래스를 람다 표현식으로 변환은 불가능함
  - 익명 클래스에서 사용한 `this`, `super`는 다른 의미를 가짐
    - 람다 `this`: 람다를 감싸는 클래스
    - 익명 클래스 `this`: 자신
  - 람다 표현식으로 변수를 가릴 수 없음 (같은 변수명 사용 불가능)
  - 익명 클래스를 람다표현식으로 바꾸면 콘텍스트 오버로딩에 모호함  
  ```java  
  interface Task {
      public void execute();
  }
  public static void doSomething(Runnable r) { r.run(); } 
  public static void doSomething(Task a) { r.execute(); }
  // 람다 표현식을 이용하면 모호함이 생기므로 명시적 형변환 필요
  doSomething((Task)() -> System.out.println("Danger danger!!")); 
  ```

## 람다 표현식을 메서드 참조로 리팩터링

람다 표현식 대신 메서드 참조를 이용하면 가독성을 높일 수 있음

```java 
inventory.sort((Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()));
inventory.sort(comparing(Apple::getWeight));
```

## 명령형 데이터 처리를 스트림으로 리팩터링

스트림을 이용하면 쇼트서킷과 게으름으로 최적화가 가능하고 멀티코어 아키텍처를 쉽게 활용할 수 있다.

```java 
List<String> dishNames = new ArrayList<>();
for (Dish dish: menu) {
    if (dish.getCalories() > 300) {
        dishNames.add(dish.getName());
    }
}

menu.parallelStream()
    .filter(d -> d.getCalories() > 300)
    .map(Dish::getName)
    .collect(toList());
```


## 코드 유연성 개선

람다 표현식을 이용하여 동작 파라미터화를 쉽게 구현할 수 있다.  
동작 파라미터화로 변화하는 요구사항에 대응할 수 있는 코드를 만든다.
조건부 연기 실행(conditional deferred execution)과 실행 어라운드(execute around) 패턴으로 람다 표현식 리팩터링을 살펴본다.

- 함수형 인터페이스 적용
  - 람다 표현식을 이용하려면 함수형 인터페이스가 필요하므로 추가
- 조건부 연기 실행
  - 클라이언트 코드에서 상태를 자주 확인하거나, 일부 메서드를 호출해야 한다면 내부적으로 호출하도록 구현하는 것이 좋음 (가독성, 캡슐화 강화)    
  ```java 
  if (logger.isLoggable(Log.FINER)) {
      logger.finer("Problem: " + generateDiagnostic());
  } 
  // 위의 코드에서 메세지 생성 과정을 연기
  public void log(Level level, Supplier<String> msgSupplier)
  logger.log(Level.FINER, () -> "Problem: " + generateDiagnostic());
  ```
- 실행 어라운드
  - 매번 같은 준비, 종료 과정을 반복적으로 수행 해야한다면 람다로 변환하여 코드 중복을 줄일 수 있음  
  ```java 
  String oneLine = processFile((BufferedReader b) -> b.readLine()); 
  String twoLines = processFile((BufferedReader b) -> b.readLine() + b.readLine());
  public static String processFile(BufferedReaderProcessor p) throws IOException {
      try(BufferedReader br = new BufferedReader(new FileReader("..."))) { 
          return p.process(br);
      }
  }
  public interface BufferedReaderProcessor { 
      String process(BufferedReader b) throws IOException;
  }
  ```

