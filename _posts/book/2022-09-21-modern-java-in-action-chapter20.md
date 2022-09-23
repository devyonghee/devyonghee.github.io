---
title: '[Modern Java in Action] Chapter20. OOP와 FP의 조화: 자바와 스칼라 비교'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 20장에서는 OOP와 FP 조화에 대해 설명한다.   
스칼라에 대해 가볍게 알아보고 자바와 스칼라의 기능을 비교해본다.  


<!--more-->

<br/>

## 20.1 스칼라 소개

스칼라의 특성에 대해 살펴볼 수 있도록 다음 사항들을 소개한다. 

- 명령형과 함수형으로 구현된 예제
- 스칼라가 지원하는 리스트, 집합, 맵, 스트림, 튜플, 옵션 등의 자료구조를 살펴보며 자바의 자료구조와 비교
- 스칼라의 트레이트 (자바의 인터페이스)


### Hello beer

#### 명령형 스칼라

```scala
object Beer {
    def main(args: Array[String]) {
        var n : Int = 2
        while (n < = 6) {
            println(s"Hello ${n}" bottoles of beer)
            n += 1
        }
    }
}
```

- 스칼라에서는 object 로 직접 싱글턴 객체를 만들 수 있음 (한 번에 단 하나의 인스턴스 생성)
- 내부 선언된 메서드는 정적 메서드로 간주 (`static` 없음)
- 문자열 보간법(string interpolation, 문자열 자체에 변수와 표현식 삽입)


#### 함수형 스칼라

자바의 함수형

```java 
public class Foo {
    public static void main(String[] args) {
        IntStream.rangeClosed(2, 6)
                 .forEach(n -> System.out.println("Hello " + n + " bottles of beer"));
    }
}
```

스칼라의 함수형

```scala
object Beer {
    def main(args: Array[String]) {
        2 to 6 foreach { n => println(s"Hello ${n} bottles of beer") }
    }
}
```

- 스칼라는 기본형이 없고 모든 것이 객체 (2는 Int 형식의 객체)
- 인픽스 형식 구현 가능 (`2.to(6)` -> `2 to 6`)
- 람다 표현식 문법은 비슷 (`->` 대신 `=>`)


### 기본 자료구조 : 리스트, 집합, 맵, 튜플, 스트림, 옵션

#### 컬렉션 만들기

```scala
val authorsToAge = Map("Raoul" -> 23, "Mario" -> 40, "Alan" -> 53)
```

- `->` 문법으로 키를 값에 대응
- 변수형 자동 추론 기능 (형식 생략 가능)
- `var` 대신 `val` 키워드 사용 (읽기 전용, 할당 불가)

```scala
// 리스트 만들기
val authors = List("Raoul", "Mario", "Alan")
// 집합 만들기
val numbers = Set(1, 1, 2, 3, 5, 8)
```


#### 불변과 가변

컬렉션은 기본적으로 불변(immutable)이다.  
스칼라에서는 자료를 공유하는 새로운 컬렉션을 만드는 방법으로 자료구조를 갱신한다.  

```scala
val numbers = Set(2, 5, 3);
val newNumbers = numbers + 8;
println(newNumbers)  // 2, 5, 3, 8
println(numbers)     // 2, 5, 3
```

#### 컬렉션 사용하기 

```scala
val fileLines = Source.fromFile("data.txt").getLines.toList()
val linesLongUpper = fileLines.filter(l => l.length() > 10)
                              .map(l => l.toUpperCase())
```

다음처럼 구현도 가능하다. 

```scala 
val linesLongUpper = fileLines filter (_.length() > 10) map (_.toUpperCase())
```

#### 튜플

자바는 튜플을 지원하지 않으므로 직접 자료구조를 구현해야 한다. 

```java 
public class Pair<X, Y> {
    public final X x;
    public final Y y;
    public Pair(X x, Y y) {
        this.x = x;
        this.y = y;
    }
}
```

스칼라는 튜플 축약어로 튜플을 만들 수 있는 기능을 제공한다. 

```scala
val raoul = ("Raoul", "+ 44 887007007")
val alan = ("Alan", "+44 883133700")

val book = (2018, "Modern Java in Action", "Manning")
val numbers = (42, 1337, 0, 3, 14)
```


#### 스트림

스칼라에서도 게으르게 평가되는 자료구조인 스트림을 제공한다.
자바의 스트림보다 다양한 기능이 존재하지만 메모리 효율성이 떨어짐

- 이전 요소가 접근할 수 있도록 기존의 계산값 기억
- 인덱스를 제공하여 인덱스로 스트림의 요소 접근 가능

#### 옵션

자바의 `Optional` 과 같은 기능 제공

```scala
def getCarInsuranceName(person: Option[Person], minAge: Int) =
    person.filter(_.getAge() >= minAge)
          .flatMap(_.getCar)
          .flatMap(_.getInsurance)
          .map(_.getName)
          .getOrElse("Unknown")
```


<br/>

## 20.2 함수

스칼라에서는 자바에 비해 많은 함수 기능을 제공한다.  

- 함수 형식
  - 자바 함수 디스크립터의 개념을 표현하는 편의 문법 (추상 메서드의 시그니처를 표현하는 개념)
- 익명 함수
  - 자바의 람다 표현식과 달리 비지역 변수 기록에 제한을 받지 않음
- 커링 지원
  - 여러 인수를 받는 함수를 일부 인수를 받는 여러 함수로 분리하는 기법

### 스칼라의 일급 함수

스칼라의 함수는 일급값(first-class value)이다. (인수 전달, 결과 반환, 변수 저장 가능)  

```scala
def isJavaMentioned(tweet: String) : Boolean = tweet.contains("Java")
def isShortTweet(tweet: String) : Boolean = tweet.length() < 20

val tweets = List(
    "I love the new features in Java 8",
    "How`s it going?"
)
tweets.filter(isJavaMentioned).foreach(println)
tweets.filter(isShortTweet).foreach(println)
```

### 익명 함수와 클로저

스칼라도 익명 함수(anonymous function)의 개념을 지원한다.  

```scala 
// apply 메서드의 구현을 제공하는 scala.Function1
val isLongTweet : String => Boolean = 
    new Function1[String, Boolean] {
        def apply(tweet : String): Boolean = tweet.length() > 60
}

// 익명 클래스 축약
val isLongTweet : String => Boolean = 
    (tweet : String) => tweet.length() > 60 // 익명 함수
    
isLongTeet.apply("A very short tweet") // false    
```

자바에서 람다 표현식을 사용할 수 있도록 `Predicate`, `Function`, `Consumer` 등의 내장 함수형 인터페이스를 제공한다.    
마찬가지로 스칼라는 트레이트를 지원한다. `Function0`(인수 없음) 에서 `Function22`(인수 22개) 를 제공한다. 


#### 클로저 

클로저란 함수의 비지역 변수를 자유롭게 참조할 수 있는 함수의 인스턴스다.  
스칼라의 익명 함수는 값이 아니라 변수를 캡처할 수 있다.

```scala
def main(args: Array[String]) {
    var count = 0
    val inc = () => count += 1
    inc()
    println(count)  // 1
    inc()
    println(count)  // 2
}
```

하지만 자바에서 위와 같은 코드를 작성하면 `count`가 `final` 이 되므로 컴파일 에러가 발생한다. 

### 커링

여러 인수를 가진 함수를 인수의 일부를 받는 여러 함수로 분할할 수 있다.

```java 
static Function<Integer, Integer> multiplyCurry(int x) {
    return (Integer y) -> x * y;
}

Stream.of(1, 3, 5, 7)
      .map(multiplyCurry(2))
      .forEach(System.out::println);
```

스칼라에서는 자동으로 처리하는 특수 문법이 존재한다. 

```scala
def multiplyCurry(x : Int)(y : Int) = x * y
var r = multiplyCurry(2)(10)
```

