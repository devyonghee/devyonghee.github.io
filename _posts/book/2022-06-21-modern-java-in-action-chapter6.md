---
title: '[Modern Java in Action] Chapter6. 스트림으로 데이터 수집'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 6장에서는 다양한 요소 누적 방식으로 리듀싱 연산하는 방법에 대해 소개한다.
`collect` 메서드에 범용적인 컬렉터를 전달하여 원하는 연산을 간결하게 구현해본다.  

<!--more-->

<br/>

## 6.1 컬렉터란 무엇인가

`Collector` 인터페이스 구현은 스트림의 요소를 어떻게 결과를 도출할지 지정한다.     
조합성과 재사용도 뛰어나며, 결과를 수집하는 과정을 간단하면서 유연하게 구현할 수 있다는 점이 큰 장점이다.  

`Collector` 에서 제공하는 메서드의 기능은 크게 세 가지가 있다.

- 스트림 요소를 하나의 값으로 리듀스하고 요약
  - 총합, 최대 최소 등 다양한 계산을 수행할 때 활용
- 요소 그룹화
  - 다수준으로 그룹화 하거나 서브그룹에 추가로 리듀싱 연산
- 요소 분할
  - 프레디케이트를 그룹화 함수로 사용



## 6.2 리듀싱과 요약

컬렉터로 스트림의 모든 항목을 하나의 결과로 도출해낼 수 있다.

- `Collectors.counting`
  - 요소의 갯수를 계산
  - 다른 컬렉터와 함께 사용할 때 특히 유용
  - `count()` 로 대체 가능
- `Collectors.maxBy`, `Collectors.minBy`
  - 스트림의 최댓값과 최솟값 계산 가능
  - `Comparator` 를 인수로 받음
- `Collectors.summingInt`, `Collectors.summingLong`, `Collectors.summingDouble`
  - 요약 팩토리 메서드
  - 요소들을 매핑한 값들의 합을 구함 (요약 연산)
  - 객체를 `int`, `long`, `double` 로 매핑하는 함수를 인수로 받음
  - `Collectors.averagingInt` (평균값), `Collectors.summarizingInt` (합계, 평균, 최댓값 등 한번에 계산) 메서드도 존재
- `Collectors.joining`
  - 추출한 모든 문자열을 하나의 문자열로 연결
  - 구분 문자열 추가 가능 (ex. `joining(", ")`)
- `Collectors.reducing`
  - 위의 모든 기능들을 `reducing` 으로도 구현 가능
  - 리듀싱 연산의 시작값, 변환 함수, 두 항목을 하나의 값으로 더하는 `BinaryOperator` 를 인수로 받음


### collect vs reduce

- `collect`
  - 도출하려는 결과를 누적하는 컨테이너를 변경하도록 설계된 메서드
  - 가변 컨테이너를 다루면서 병렬성도 확보 가능
- `reduce`
  - 두 값을 하나로 도출하는 불변형 연산
  - 여러 스레드가 동시에 데이터 구조체를 변경하면 문제가 발생되므로 병렬 수행 불가능 (매번 새로운 리스트를 할당한다면 성능저하)

## 6.3 그룹화

그룹화는 데이터 집합을 하나 이상의 특성으로 분류하는 작업이다.  
자바 8의 함수형과 팩토리 메서드 `Collectors.groupingBy` 를 이용하면 가독성있는 그룹화를 구현할 수 있다.

```java 
Map<Dish.Type, List<Dish>> dishesByType = 
    menu.stream()
        .collect(groupingBy(Dish::getType));

{ FISH=[prawns, salmon], OTHER=[french fries, rice, season, fruit, pizza], MEAT=[pork, beef, chicken] }        
```

`groupingBy` 에 두 번째 인수를 이용하면 다양한 문제를 해결할 수 있다.

- `filtering`  
  프레디케이트로 키를 유지하면서 필터링이 가능
  ```java 
  Map<Dish.Type, List<Dish>> dishesByType = 
      menu.stream()
          .collect(groupingBy(Dish::getType, 
                   filtering(dish -> dish.getCalories() > 500, toList())));
  
  { OTHER=[french fries, pizza], MEAT=[pork, beef], FISH=[] }
  ```

- `mapping`  
  각 항목에 함수를 적용한 리스트를 모음
  ```java 
  Map<Dish.Type, List<String>> dishNamesByType = 
      menu.stream()
          .collect(groupingBy(Dish::getType, mapping(Dish::getName, toList())));
  ```

- `flatMapping`  
  리스트를 한수준으로 평면화
  ```java 
  Map<Dish.Type, Set<String>> dishTagsByType = 
      menu.stream()
          .collect(groupingBy(Dish::getType, 
                   flatMapping(dish -> dishTags.get( dish.getName() ).stream(), toSet())));
  ```

- 다수준그룹화  
  `groupingBy` 를 이용하여 두 수준으로 그룹화 가능
  ```java 
  Map<Dish.Type, Map<CaloricLevel, List<Dish>>> dishesByTypeCaloricLevel = 
      menu.stream()
          .collect(groupingBy(Dish::getType, 
                   groupingBy(dish -> 
                       if (dish.getCalories() <= 400) {
                           return CaloricLevel.DIET;
                       } else if (dish.getCalories() <= 700) {
                           return CaloricLevel.NORMAL; 
                       } else {
                           return CaloricLevel.FAT;
                       }
                    )));
  
  { MEAT={ DIET=[chicken], NORMAL=[beef], FAT=[pork] }, 
    FISH={ DIET=[prawns], NORMAL=[salmon] },
    OTHER={ DIET=[rice, seasonal fruit], NORMAL=[french fries, pizza] } }
  ```

- `counting`  
  종류별로 갯수를 계산
  ```java 
  Map<Dish.Type, Long> typesCount = 
      menu.stream()
          .collect(groupingBy(Dish::getType, counting()));
  
  { MEAT=3, FISH=2, OTHER=4 }
  ```
  
- `maxBy`  
  최대 값의 종류
  ```java 
  Map<Dish.Type, Optional<Dish>> mostCaloricByType = 
      menu.stream()
          .collect(groupingBy(Dish::getType, 
                              maxBy(comparingInt(Dish::getCalories))));
  
  { FISH=Optional[slamon], OTHER=Optional[pizza], MEAT=Optional[pork] }
  ```

- `collectingAndThen`  
  컬렉터가 반환한 결과를 다른 형식으로 활용  
  리듀싱 컬렉터는 `Optional.empty()`를 반환하지 않으므로 안전한 코드
  ```java 
  Map<Dish.Type, Dish> mostCaloricByType = 
      menu.stream()
          .collect(groupingBy(Dish::getType, 
                              collectingAndThen(
                                  maxBy(comparingInt(Dish::getCalories)),
                              Optional::get)));
  
  { FISH=slamon, OTHER=pizza, MEAT=pork }
  ```
  
- `summingInt`  
  모든 요소의 합계
  ```java 
  Map<Dish.Type, Integer> mostCaloricByType = 
      menu.stream()
          .collect(groupingBy(Dish::getType, 
                              summingInt(Dish::getCalories)));
  ```
  
## 6.4 분할

분할은 분할 함수(partitioning function) 이라는 프레디케이트를 사용하는 그룹화 기능이다.  
분할 함수는 불리언을 반환하므로 키 형식은 `Boolean`으로 두 개의 그룹으로 분류된다.

```java 
Map<Boolean, List<Dish>> partitionedMenu = 
    menu.stream().collect(partitioningBy(Dish::isVegetarian));
    
{ false = [pork, beef, chicken, prawns, salmon], 
  true = [french fries, rice, season fruit, pizza] }
```

`groupingBy`와 마찬가지로 `partitioningBy` 에 두 번째 인수를 이용하면 다양하게 활용 가능하다. 

- `groupingBy`  
  ```java 
  Map<Boolean, Map<Dish.Type, List<Dish>> vegetarianDishesByType = 
      menu.stream().collect(
          partitioningBy(Dish::isVegetarian, groupingBy(Dish::getType)));
  
  { false = {FISH=[prawns, salmon], MEAT=[pork, beef, chicken]}
    true = {OTHER=[french fries, rice, season fruit, pizza]}}
  ```

- `collectingAndThen`  
  ```java 
  Map<Boolean, Dish> mostCaloricPartitionedByVegetarian = 
      menu.stream().collect(
          partitioningBy(Dish::isVegetarian, 
              collectingAndThen(maxBy(comparingInt(Dish::getCalories)), Optional::get)));
  
  { false = pork, true = pizza}
  ```  


## 6.5 Collector 인터페이스

Collector 인터페이스를 직접 구현하여 효율적으로 문제를 해결해본다.

```java 
public interface Collector<T, A, R> {
    Supplier<A> supplier();
    BiConsumer<A, T> accumulator();
    Function<A, R> finisher();
    BinaryOperator<A> combiner();
    Set<Characteristics> characteristics();
}
```

- `T` 는 수집될 스트림 항목의 제네릭 형식
- `A` 는 누적자, 수집 과정에서 중간 결과를 누적하는 객체의 형식
- `R` 은 수집 연산 결과 객체의 형식 

### Collector 메서드 살펴보기

- `supplier` 메서드: 새로운 결과 컨테이너 생성
  - 수집 과정에서 빈 누적자 인스턴스를 만드는 함수  
  ```java
  public Supplier<List<T>> supplier() {
      return ArrayList::new;
  }
  ```
  
- `accumulator` 메서드: 결과 컨테이너에 요소 추가
  - 리듀싱 연산을 수행하는 함수
  - 누적자(n-1개 항목을 수집한 상태)와 n번째 요소를 함수에 적용  
  ```java
  public BiConsumer<List<T>, T> accumulator() {
      return List::add;
  }
  ```
  
- `finisher` 메서드: 최종 변환값을 결과 컨테이너로 적용하기
  - 누적과정을 끝낼 때 호출할 함수
  - 스트림 탐색을 끝내고 누적자 객체를 최종 결과로 변환  
  ```java
  // 변환 과정이 필요없는 경우
  public Function<List<T>, List<T>> finisher() {
      return Function.identity();
  }
  ```

- `combiner` 메서드: 두 결과 컨테이너 병합
  - 리듀싱 연산에서 사용할 함수
  - 스트림의 서로 다른 서브파트를 병렬로 처리할 때 결과를 어떻게 처리할지 정의
  - 스트림의 리듀싱을 병렬로 수행 가능
  ```java
  public BinaryOperator<List<T>> combiner() {
      return (list1, list2) -> {
          list1.addAll(list2);
          return list1; 
      };
  }
  ```

- `characteristics` 메서드
  - 컬렉터의 연산을 정의하는 `characteristics` 형식의 불변 집합
  - 스트림을 병렬로 리듀스할 것인지, 리듀스한다면 어떤 최적화를 선택하는지 힌트 제공
    - `UNORDERED`: 리듀싱 결과는 스트림 요소의 방문 순서나 누적 순서에 영향 없음
    - `CONCURRENT`: 다중 스레드에서 `accumulator` 동시 호출 가능, `UNORDERED`을 함께 설정하지 않았다면 정렬안된 상태에서만 병렬 리듀싱 수행 가능
    - `IDENTITY_FINISH`: `finisher` 메서드가 반환되는 함수는 `identity` 를 적용하므로 생략 가능


### Collector 구현 없이 커스텀 수집

세 함수를 인수로 받는 `collector` 메서드를 통해 `Collector` 와 비슷한 기능 수행  
하지만 다음과 같은 단점들이 존재한다.

- 코드는 간결하지만 가독성이 떨어짐
- 커스텀 컬렉터를 구현하는 것이 중복도 피하고 재사용성이 높음
- `Characteristics` 전달 불가능 (`IDENTITY_FINISH` 와 `CONCURRENT` 지만 `UNORDERED` 아닌 컬렉터로만 동작)

```java 
List<Dish> dishes = menuStream.collect(
    ArrayList::new,   // 발행
    List::add,        // 누적
    List::addAll);    // 합침
```

## 6.6 커스텀 컬렉터를 구현해서 성능 개선하기 

n 까지의 자연수를 소수와 비소수로 분할하는 컬렉터를 직접 구현한다. 

```java 

public class PrimeNumbersCollector implements 
    Collector<Integer, Map<Boolean, List<Integer>>, Map<Boolean, List<Integer>>> {
    
    @Override
    public Supplier<Map<Boolean, List<Integer>>> supplier() {
        return () -> new HashMap<Boolean, List<Integer>>() { {
            put(true, new ArrayList<Integer>());
            put(false, new ArrayList<Integer>());
        } };
    }
    
    @Override
    public BiConsumer<Map<Boolean, List<Integer>>, Integer> accumulator() {
        return (Map<Boolean, List<Integer>> acc, Integer candidate) -> {
            acc.get( isPirme( acc.get(true), candidate)).add(candidate);
        };
    }
    
    @Override
    publid BinaryOperator<Map<Boolean, List<Integer>>> combiner() {
        return (Map<Boolean, List<Integer>> map1, Map<Boolean, List<Integer>> map2) -> {
            map1.get(true).addAll(map2.get(true));
            map1.get(false).addAll(map2.get(false));
        }
    }
    
    @Override
    public Function<Map<Boolean, List<Integer>>, Map<Boolean, List<Integer>>> finisher() {
        // 최종 수집 과정에 변환이 필요 없음
        return Function.identity();
    }    
    
    @Override
    public Set<Characteristics> characteristics() {
        // 소수의 순서에 의미가 있으므로 UNORDERED, CONCURRENT 가 아님
        return Collections.unmodifiableSet(EnumSet.of(IDENTITY_FINISH));
    } 
}

IntStream.rangeClosed(2, n).boxed()
    .collect(new PrimeNumbersCollector()); 
```

