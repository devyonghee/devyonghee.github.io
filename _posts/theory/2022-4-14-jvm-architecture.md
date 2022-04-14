---
title: 자바 가상 머신(JVM, Java Virtual Machine) 자세히 알아보기
tags: [process, thread]
categories: theory
---

JVM 은 Java Virtual Machine 의 약자로 자바 가상 머신을 의미한다.  
자바 개발자라면 자바 코드가 이 JVM 에 의해서 실행된다는 것을 알고 있을 것이다.  
    
<!--more-->

## JVM (Java Virtual Machine)

JVM 은 JAVA 와 OS 사이의 중개자 역할로 Java Byte Code 를 OS 에 맞게 해석하고 실행한다.  
그렇기 때문에 자바는 JVM 덕분에 OS에 종속되지 않고 실행될 수 있다. 

Java compiler(`javac`) 는 java 소스 코드(`*.java`)를 java byte code(`*.class`) 로 변환시켜준다.  
하지만 이 java byte code 는 기계어가 아니기 OS 에서 바로 실행이 불가능하다.  
이 java byte code 는 Class Loader 에 의해 JVM 에 적재된다.  
JVM 에 적재된 코드는 JIT 컴파일 방식으로 실행된다.




## 출처
- [https://d2.naver.com/helloworld/1230](https://d2.naver.com/helloworld/1230)
- [https://asfirstalways.tistory.com/158](https://asfirstalways.tistory.com/158)