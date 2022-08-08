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

<br/>

## 9.2 람다로 객체지향 디자인 패턴 리팩터링

### 전략 패턴 (strategy pattern)

전략 패턴은 한 유형의 알고리즘을 보유하여 런타임에 적절한 알고리즘을 선택하는 기법이다.

{% include image.html alt="strategy pattern" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/strategy-pattern.png" %}

- 알고리즘을 나타내는 인터페이스 (Strategy 인터페이스)
- 다양한 알고리즘을 나타내는 한 개 이상의 인터페이스 구현(ConcreteStrategyA, ConcreteStrategyB)
- 전략 객체를 사용한 한 개 이상의 클라이언트

```java
// strategy
public interface ValidationStrategy {
    boolean execute(String s);
}
// concrete
public class IsAllLowerCase implements ValidationStrategy {
    public boolean execute(String s) {
        return s.matches("[a-z]+");
    }
}
// client
public class Validator {
    private final ValidationStrategy strategy;
    public Validator(ValidationStrategy v) {
        this.strategy = v;
    }
    public boolean validate(String s) {
        return strategy.execute(s);
    }
}
Validator nemericValidator = new Validator(new IsNumeric());
```


`ValidationStrategy` 은 함수형 인터페이스로 `Predicate<String>` 함수 디스크립터를 가지고 있어서 람다 표현식으로 변경 가능

```java
Validator numericValidator = new Validator((String s) -> s.matches("[a-z]+"));
numericValidator.validate("aaaaa");
```

### 템플릿 메서드 (template method)

템플릿 메서드 패턴을 사용하면 알고리즘의 일부를 고칠 수 있는 유연함을 제공할 수 있다. 

```java 
abstract class OnlineBanking {
    public void processCustomer(int id) {
        Customer c = Database.getCustomerWithId(id);
        makeCustomerHappy(c);
    }
    abstract void makeCustomerHappy(Customer c);
}
```

람다 표현식을 이용해서 유연하게 변경이 가능

```java 
public void processCustomer(int id, Consumer<Customer> makeCustomerHappy) {
    Customer c = Database.getCustomerWithId(id);
    makeCustomerHappy.accept(c);
}
new OnlineBankingLambda()
    .processCustomer(1337, (Customer c) -> System.out.println("Hello " + c.getName());
```

### 옵저버 패턴 (Observer pattern)

옵저버 패턴은 특정 이벤트가 발생했을 때, 한 객체(주제 subject)가 다른 객체 리스트(옵저버 observer)에 자동으로 알림을 보내는 패턴이다.

{% include image.html alt="observer pattern" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/observer-pattern.png" %}

```java  
// observer
interface Observer {
    void notify(String tweet);
}
class NYTimes implements Observer {
    public void notify (String tweet) { 
        if (tweet.contains("money")) {
            System.out.println("Breaking news in NY! " + tweet);
        }    
    }
}
// subject
interface Subject {
    void registerObserver(Observer o);
    void notifyObservers(String tweet);
}
class Feed implements Subject {
    private final List<Observer> observers = new ArrayList<>();
    public void registerObserver (Observer o) {
        this.observers.add(o);
    }
    public void notifyObservers(String tweet) {
        observers.forEach(o -> o.notify(tweet));
    }
}
// client
Feed f = new Feed();
f.registerObserver(new NYTimes());
f.notifyObservers("The queen said her favourite book is Modern Java in Action!");
```

`Observer` 인터페이스를 구현하는 모든 클래스를 인스턴스화하지 않고 람다 표현식을 직접 전달하여 동작을 지정한다.

```java 
f.registerObserver((String tweet) -> {
    if (tweet.contains("money")) {
        System.out.println("Breaking news in NY! " + tweet);
    }
});
f.notifyObservers("The queen said her favourite book is Modern Java in Action!");
```

### 의무 체인(chain of responsibility)

의무 체인 패턴을 이용하면 작업 처리 객체의 체인을 만들 수 있다. 

{% include image.html alt="chain of responsibility pattern" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/chain-of-responsibility-pattern.png" %}

```java 
public abstract class ProcessingObject<T> {
    protected ProcessingObject<T> successor;
    public void setSuccessor(ProcessingObject<T> successor) {
        this.successor = successor;
    }
    public T handle(T input) {
        T r = handleWork(input);
        if (successor != null) {
            return successor.handle(r);
        }
        return r;
    }
    abstract protected T handleWork(T input);
}

public class HeaderTextProcessing extends ProcessingObject<String> {
    public String handleWork(String text) {
        return "From Raoul, Mario and Alan: " + text;
    }
}
public class SpellChckerProcessing extends ProcessingObject<String> {
    public String handleWork(String text) {
        return text.replaceAll("labda", "lambda");
    }
}
// client
ProcessingObject<String> p1 = new HeaderTextProcessing();
ProcessingObject<String> p2 = new SpellCheckerProcessing();
p1.setSuccessor(p2);
p1.handle("Aren`t labdas really sexy?!!");  // From Raoul, Mario and Alan: Aren`t lambdas really sexy?!! 
```

`andThen`으로 함수를 조합해서 체인 생성이 가능하다.

```java 
UnaryOperator<String> headerProcessing = (String text) -> "From Raoul, Mario and Alan: " + text;
UnaryOperator<String> spellChckerProcessing = (String text) -> text.replaceAll("labda", "lambda");
Function<String, String> pipeline = headerProcessing.andThen(spellChckerProcessing);
pipeline.apply(...);
```

### 팩토리 (factory)

팩토리 패턴은 인스턴스화 로직을 클라이언트에 노출하지 않고 객체를 만들 수 있다. 

```java  
public class ProductFactory { 
    public static Product createProduct(String name) {
        switch(name) {
            case "loan" : return new Loan();
            case "stock" : return new Stock();
            case "bond" : return new Bond();
            default : throw new RuntimeException("No such product " + name);
        }
    }
}
// client
Product p = ProductFactory.createProduct("loan");
```

생성자도 메서드 참조처럼 접근할 수 있으므로 `Map`을 만들어서 코드를 재구현 가능

```java 
final static Map<String, Supplier<Product>> map = new HashMap<>();
static {
    map.put("loan", Loan::new);
    map.put("stock", Stock::new);
    map.put("bond", Bond::new);
}
// client
public static Product createProduct(String name) {
    Supplier<Product> p = map.get(name);
    if (p != null) return p.get();
    throw new IllegalArgumentException("No such product " + name);
}
```

<br/>

## 9.3 람다 테스팅

프로그램이 의도한대로 동작하는 것을 확인하기 위해서는 단위 테스팅(unit testing) 이 필요하다.  
예시를 통해 람다를 이용하여 테스트 코드를 작성해보도록 한다.

```java 
public class Point {
    private final int x;
    private final int y;
    private Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    public int getX() { return x; }
    public int getY() { return y; }
    public Point moveRightBy(int x) {
        return new Point(this.x + x, this.y);
    }
}

@Test
public void testMoveRightBy() throws Exception {
    Point p1 = new Point(5, 5);
    Point p2 = p1.moveRightBy(10);
    assertEquals(15, p2.getX());
    assertEquals(5, p2.getY());
}
```

### 람다 표현식의 동작 테스팅

람다를 필드에 저장해서 재사용할 수 있고 로직을 테스트할 수 있다.

```java 
public class Point {
    public final static Comparator<Point> compareByXAndThenY = 
        comparing(Point::getX).thenComparing(Point::getY);
}
@Test
public void testComparingTwoPoints() throws Exception {
    Point p1 = new Point(10, 15);
    Point p2 = new Point(10, 20);
    int result = Point.compareByXAndThenY.compare(p1, p2);
    assertTrue(result < 0);
}
```

### 람다를 사용하는 메서드의 동작에 집중하라

람다는 정해진 동작을 다른 메서드에서 사용할 수 있으나 캡슐화하는 것이 목표이므로 세부 구현을 공개하지 않아야 한다. 

```java
public static List<Point> moveAllPointsRightBy(List<Point> points, int x) {
    return points.stream()
                 .map(p -> new Point(p.getX() + x, p.getY()))
                 .collect(toList());
}
@Test
public void testMoveAllPointsRightBy() throws Exception {
    List<Point> points = Arrays.asList(new Point(5, 5), new Point(10, 5));
    List<Point> expectedPoints = Arrays.asList(new Point(15, 5), new Point(20, 5));
    List<Point> newPoints = Point.moveAllPointsRightBy(points, 10);
    assertEquals(expectedPoints, newPoints);
}
```

### 복잡한 람다를 개별 메서드로 분할하기

복잡한 람다 표현식은 테스트를 작성하는 것도 어렵다.   
그러나 람다 표현식을 메서드 참조로 바꿔서 일반 메서드처럼 분할한다면 테스트가 수월해진다.

### 고차원 함수 테스팅

함수를 인수로 받거나 다른 함수를 반환하는 메서드는 사용하기 어렵다.  
메서드가 람다를 인수로 받는다면 다른 람다로 메서드의 동작을 테스트가 가능하다.  
테스트할 메서드가 다른 함수를 반환한다면 함수형 인터페이스의 인스턴스로 간주하고 함수의 동작을 테스트할 수 있다.

```java 
@Test
public void testFilter() throw Exception { 
    List<Integer> numbers = Arrays.asList(1, 2, 3, 4);
    List<Integer> even = filter(numbers, i -> i % 2 == 0);
    List<Integer> smallerThanThree = filter(numbers, i -> i < 3);
    assertEquals(Arrays.asList(2, 4), even);
    assertEquals(Arrays.asList(1, 2), smallerThanThree);
}
```

<br/>

## 9.4 디버깅

코드를 디버깅할 때 개발자는 스택 트레이스와, 로깅을 확인한다.  
하지만 람다 표현식과 스트림은 기존의 디버깅 기법을 무력화하기 때문에 다른 디버깅 방법을 살펴보도록 한다.

### 스택 트레이스 확인

프로그램이 중단되면 호출 위치, 인수값, 지역 변수 등을 스택 프레임(stack frame)에서 확인이 가능하다.    
하지만 람다 표현식은 이름이 없기 때문에 조금 복잡한 스택 트레이스가 생성된다.  

```java 
public class Debugging {
    public static void main(String[] args) {
        List<Point> points = Arrays.asList(new Point(12, 2), null);
        points.stream().map(p -> p.getX()).forEach(System.out::println);
    }
}
```

```text
Exception in thread "main" java.lang.NullPointerException
    at Debugging.lambda$main$0(Debugging.java:6)
    at Debugging$$Lambda$5/284720968.apply(Unknown Source)
    at java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:193)
    at java.util.Spliterators$ArraySpliterator.forEachRemaining(Spliterators.java:948)  
```

람다 표현식은 이름이 없으므로 컴파일러가 람다를 참조하는 `lambda$main$0` 같은 이름을 만들어낸다.   
메서드 참조를 사용하는 클래스와 같은 곳에 있는 메서드를 참조하면 메서드 참조 이름이 스택 트레이스에 나타난다.

```java 
public class Debugging {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3);
        numbers.stream().map(Debugging::divideByZero).forEach(System.out::println);
    }
    public static int divideByZero(int n) {
        return n / 0;
    }
}
```

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at com.sodacrew.admin.auth.Debugging.divideByZero(Debugging.java:10)
	at java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:193)
	...
```

### 정보 로깅

스트림의 파이프라인 연산을 디버깅한다면 `peek` 이라는 스트림 연산을 활용할 수 있다.  
`peek` 연산은 각 요소를 소비하지 않고 다음 연산으로 그대로 전달한다.

```java 
List<Integer> result = numbers.stream()
        .peek(x -> System.out.println("from stream: " + x))
        .map(x -> x + 17)
        .peek(x -> System.out.println("after map: " + x))
        .collect(Collectors.toList());
```

