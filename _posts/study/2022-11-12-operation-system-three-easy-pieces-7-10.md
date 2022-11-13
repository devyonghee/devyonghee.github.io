---
title: '[Study] 운영체제 아주 쉬운 세가지 이야기 7장~10장'
tags: [study, book, operation-system]
categories: study
---

운영체제 아주 쉬운 세가지 이야기 책에 대한 스터디를 진행한다.  
이 글에서는 7장부터 10장까지의 내용을 정리한다. 

<!--more-->

## 7장. 스케줄링: 개요

이 장에서는 다양한 **스케줄링 정책(scheduling policy)** 에 대해 소개한다.  

## 7.1 워크로드에 대한 가정

**워크로드(workload)** 는 프로세스가 동작하는 일련의 행위를 의미한다.  
스케줄링 정책 개발을 위해서는 적절한 워크로드 선정이 중요하다.  

시스템에서 실행 중인 프로세스 또는 작업(job) 에 대해 다음과 같은 가정을 한다.  

1. 모든 작업은 같은 시간 동안 실행
2. 모든 작업은 동시에 도착
3. 작업은 일단 시작하면 최종적으로 종료될 때까지 실행
4. 모든 작업은 CPU만 사용
5. 작업의 실행 시간은 사전에 알려져 있음 (매우 비현실적)

## 7.2 스케줄링 평가 항목

스케줄링 정책 평가를 위해 **스케줄링 평가 항목(scheduling metric)** 결정 필요  

#### 반환 시간(turnaround time)

작업이 완료된 시각에서 작업이 도착한 시각을 뺀 시간 (성능 측면 평가)  
모든 작업은 동시에 도착한다고 가정했으므로 T(arrival) = 0 

{% include image.html alt="scheduling metric turnaround time" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-metric-turnaround-time.png" %}


#### 공정성(fairness)

**Jain`s Fairness Index** 라는 지표가 공정성 지표의 한 예  
성능과 공정성은 스케줄링에서 서로 상충 (ex. 성능을 극대화하기 위해 다른 작업에게 실행 기회를 안줄 수 있음)


## 7.3 선입선출

**선입선출(First In First Out, FIFO)** 또는 **선도착선처리(First Come First Served, FCFS)** 은 가장 기본적인 알고리즘  
단순하고 구현하기 쉽고 세워놓은 가정 하에서는 잘 동작한다. 

{% include image.html alt="FIFO" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-policy-fifo.png" %}

작업 3개가 거의 동시에 들어왔다고 가정하면 위 작업의 평균 반환 시간은 (10+20+30) / 3 = 20  

{% include image.html alt="FIFO" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-policy-fifo.png" %}

하지만 가정 1(모든 작업은 같은 시간 동안 실행)이 없어져서 작업 A 가 100초 동안 실행된다면 평균 반환시간은 (100+110+120) / 3 = 110 으로 된다.  
이 현상을 **convoy effect** 라고 한다.  
CPU 가 많이 필요하지 않은 프로세스들이 오랫동안 CPU 를 사용하는 프로세스를 기다리는 현상을 의미 

## 7.4 최단 작업 우선

{% include image.html alt="SJF" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-policy-sjf.png" %}

convoy effect 문제는 최단 **작업 우선(Short Job First, SJF)** 으로 해결한다.  
이 기법은 짧은 시간을 가진 작업을 먼저 실행한다.   
평균 반환시간은 (10+20+120) / 3 = 50 으로 2배 이상 향상됐다.

{% include image.html alt="SJF" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-policy-sjf-problem.png" %}

하지만 가정 2(모든 작업은 동시에 도착)가 없어져서 작업이 임의의 시간에 도착한다면 또 다른 문제가 발생된다.  
B 와 C 가 늦게 도착한다면 A 를 기다릴 수 밖에 없어서 **convoy effect** 문제가 다시 발생된다.  


## 7.5 최소 잔여시간 우선

이 문제를 해결하기 위해서는 가정 3(작업은 일단 시작하면 최종적으로 종료될 때까지 실행)을 제거하여 작업을 실행 도중에 중단해야 한다.  
위에서 다룬 SJF 는 비선점형 스케줄러이기 때문에 실행중인 작업을 중단하지 못한다.     

{% include image.html alt="STCF" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-policy-stcf.png" %}

**최단 잔여시간 우선(Shortest Time-to-Completion First, STCF)** 또는 **선점형 최단 작업 우선(PSJF)** 는 SJF 에 선점 기능을 추가했다.  
새로운 작업이 도착하면 실행중인 작업의 잔여 시간과 비교하여 가장 작은 작업을 스케줄 한다.  


## 7.6 새로운 평가 기준: 응답 시간

시분할 컴퓨터가 등장하면서 사용자는 상호작용을 원활히 하기 위해 성능을 요구하게되었다.  
응답 시간(response time) 이라는 평가 기준이 추가되었다. 

{% include image.html alt="scheduling metric response time" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-metric-response-time.png" %}

응답 시간은 작업이 도착하는 시점부터 처음으로 스케줄 될 때까지의 시간이다.  
반환 시간이 좋아도 다른 작업이 먼저 스케줄되어 응답이 계속 늦어진다면 상호작용 측면에서 매우 불편할 것이다.  


## 7.7 라운드 로빈

{% include image.html alt="Round Robin" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-metric-response-time.png" %}

응답 시간 문제를 해결하기 위해 라운드 로빈(Round-Robin, RR 또는 타임 슬라이싱) 스케줄링이 도입된다.  
RR 은 작업이 끝날 때까지 기다리지 않고 일정 시간동안 실행하고 실행 큐의 다음 작업으로 전환한다.  
작업이 실행되는 일정 시간을 **타임 슬라이스(time slice)** 또는 **스케줄링 퀀텀(scheduling quantum)** 이라 하고
이 시간은 타임 인터럽트 주기의 배수여야 한다.  
RR 은 **공정**한 정책으로 응답 시간에 대한 성능은 좋지만 반환 시간 측정 기준으로는 최악이다.   

타임 슬라이스가 너무 짧으면 **문맥 교환(context switch)** 이 자주 발생되어 성능에 큰 영향을 미친다.  
문맥 교환 비용을 상쇄할 수 있을 만큼길고 응답 시간이 길지 않은 적절한 타입슬라이스의 길이를 결정해야 한다. 


## 7.8 입출력 연산의 고려

모든 프로그램은 입출력 작업을 수행하도록 가정 4(모든 작업은 CPU만 사용) 를 제거한다.  
실행중인 프로세스가 입출력 작업을 요청하면 스케줄러는 어떤 작업을 실행할지 결정해야 한다.
반대로 입출력 완료되어 인터럽트가 발생하고 프로세스가 대기에서 준비 상태로 변경되면 어떤 프로세스를 실행할지 결정해야 한다.  

{% include image.html alt="중첩을 통해 자원 활용" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/scheduling-policy-nested.png" %}

STCF 스케줄러를 이용하여 두 작업 A, B 를 처리한다.  
A 는 입출력 작업 요청으로 5개의 10 msec 작업, B는 한번에 50 mesc 사용한다.

STCF 은 우선 가장 짤은 작업인 A를 선택한다.  
A 첫 번째 소 작업이 완료되면 B 를 실행하고 다음 A 가 도착하면 다시 A 를 실행한다.  
하나의 프로세스가 입출력 완료를 대기하는 동안 다른 프로세스가 CPU 를 사용하여 연산의 중첩이 가능해져 시스템 사용률을 향상시킬 수 있다.  


## 7.9 만병통치약은 없다(No More Oracle)

일반적인 운영체제에서 작업의 길이를 미리 알 수 없다. (가정 5)    
사전 지식 없이 SJF/STCF 알고리즘 구축과 RR 스케줄러의 아이디어를 도입하는 것은 쉽지 않다.