---
title: '[Study] 운영체제 아주 쉬운 세가지 이야기 12장~16장'
tags: [study, book, operation-system]
categories: study
---

운영체제 아주 쉬운 세가지 이야기 책에 대한 스터디를 진행한다.  
이 글에서는 가상화에 대해 다룬 12장부터 15장까지의 내용을 정리한다. 

<!--more-->

## 12장. 메모리 가상화에 관한 대화

- 가상 메모리 관리자의 동작
  - 베이스-바운드
  - TLB 와 멀티 레벨 페이지 테이블 문제 해결 방법
- 사용자 프로그램이 생성하는 모든 주소는 **가상 주소**
  - 사용하기 쉬운 시스템을 제공하기 위함
  - 프로세스에게 대용량 연속된 주소 공간(address space)을 가지고 있다고 시각을 제공
  - 고립(isolation) 과 보호(protection)
    - 다른 프로세스의 메모리를 읽거나 변경할 수 없음


<br/>

## 13장. 주소 공간의 개념

사용자들은 컴퓨터 시스템에 "사용자 편이", "고성능", "신뢰성" 등에 대해 기대한다. 

### 13.1 초기 시스템

{% include image.html alt="운영체제: 초기" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/early-operating-system.png" %}

초기 컴퓨터에서는 물리 메모리는 위 의 그림과 같이 생겼다.  
물리 메모리 하나에 실행 중인 프로그램이 존재하고 운영체제는 나머지 메모리를 사용했다.  

### 13.2 멀티프로그래밍과 시분할

{% include image.html alt="세 개의 프로세스: 공유 메모리" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/process-share-memory.png" %}

**멀티프로그래밍(multi-programming)** 이 나오면서 운영체제는 여러 프로세스를 전환하며 실행했다.  
더 많이 사용하기 위해 **시분할(time-sharing)** 이 시작되면서 현재 실행 중인 작업의 응답을 받기 위해 **대화식 이용(interactivity)** 의 개념이 중요하게 되었다.

시분할을 구현하기 위해 하나의 프로세스를 짧게 수행하게 된다.  
프로세스 중단 시점의 모든 상태를 물리 메모리를 포함한 디스크 장치에 저장하고 다른 프로세스를 탑재한다.   
하지만 이런 방식은 메모리가 커질수록 특히 더 느리게 동작하기 때문에 문제가 있다. 

또한, 프로그램이 메모리에 동시에 존재하기 위해서는 다른 프로세스의 데이터를 읽거나 갱신하지 않도록 **보호(protection)** 문제도 중요하다.  


### 13.3 주소 공간

{% include image.html alt="주소 공간 예" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/address-space.png" %}

메모리를 보호하기 위해 만든 개념이 **주소 공간(address space)** 이다.  
주소 공간은 코드(명령어), 스택(현재 위치, 지역 변수, 함수 인자 등), 힙(동적으로 할당) 같은 프로그램의 모든 메모리 상태를 가지고 있다.  

코드는 정적이기 때문에 메모리에 저장하기 쉽다.
스택과 힙은 모두 확장할 수 있어야 하기 때문에 양 끝단에 배치해야 한다. 
하지만 이는 관례일 뿐 여러 쓰레드가 공존할 때 이렇게 나누면 동작하지 않는다.  

주소 공간은 운영체제가 실행중인 프로그램에게 제공하는 **개념(abstraction)** 인 것이다.  
프로그램은 실제로 물리주소 0~16KB 가 아닌 임의의 물리 주소에 탑재된다.
이를 **메모리 가상화(virtualizing memory)** 한다고 한다.  

결국 실행중인 프로그램은 특정 주소 메모리에 탑재되고 매우 큰 주소 공간을 가지고 있다고 생각한다.  

### 13.4 목표

가상 메모리 시스템의 목표는 다음과 같다. 

- **투명성(transparency)**
  - 실행 중인 프로그램이 가상 메모리의 존재를 인지하지 못하고 물리 메모리를 소유한 것처럼 구현

- **효율성(efficiency)**
  - 시간적 측면: 너무 느리게 실행되서는 안됨
  - 공간적 측면: 가상화를 위한 구조를 위해 많은 메모리를 사용하면 안됨

- **보호(protection)**
  - 다른 프로세스가 메모리에 접근하지 못하도록 보호 (격리, isolate)

<br/>

## 14장. 막간: 메모리관리 API

Unix 의 메모리 관리 인터페이스에 대해 알아본다.

### 14.1 메모리 공간의 종류

프로그램이 실행되면 두 가지 유형의 메모리 공간이 할당

- 스택(stack) 메모리
  - 할당과 반환은 컴파일러에 의해 암묵적으로 수행 (자동 메모리라고도 불림)

```c 
void func() {
    int x; // 스택에 int 형 선언
    ...    // 리턴하면 컴파일러가 메모리 반환
}
```

- 힙 메모리(heap)
  - 할당과 반환이 프로그래머에 의해 처리
  - 많은 버그의 원인이 될 수 있음

```c 
void func() {
    int *x = (int *) malloc(sizeof(int));   // 스택과 힙 모두 할당
}
```


### 14.2 malloc() 함수

```c 
#include <stdlib.h>
...
void *malloc(size_t size);
```

힙에 요청할 공간의 바이트 크기를 넘겨주면 할당된 공간에 대한 포인터 반환 (실패하면 NULL)  

```c 
double *d = (double *) malloc(sizeof(double));
```

이 호출에서는 정확한 크기의 공간을 요청하기 위해 `sizeof` 연산자 사용  
인자의 크기는 컴파일 시간에 결정 (함수 호출이 아님)

### 14.3 free() 함수

```c 
int *x = malloc(10 * sizeof(int));
...
free(x);
```

더 이상 사용되지 않는 힙 메모리를 해제하기 위해 `free()` 호출  
`malloc()` 에서 반환된 포인터 받음

### 14.4 흔한 오류

올바른 메모리 관리를 위해 많은 새로운 언어들이 쓰레기 수집기를 통해 자동 메모리 관리(automatic memory management)를 지원한다.

#### 메모리 할당 잊어버리기

다음과 같이 메모리 할당을 하지 않으면 **세그멘테이션 폴트(segmentation fault)** 가 발생할 가능성이 높다.

```c 
char *src = "hello";
char *dst;
strcpy(dst, src);
```

메모리 할당을 하기 위해서 다음과 같이 코드를 작성해야 한다.

```c 
char *src = "hello";
char *dst = (char *) malloc(strlen(src) + 1);
strcpy(dst, src);
```


#### 메모리를 부족하게 할당받기

메모리를 부족하게 할당받는 것을 **버퍼 오버플로우(buffer overflow)** 라고 한다.  
이러한 오버플로우가 유해할 수 있고 많은 시스템에서 보안 취약점의 원인이 될 수 있다.  

```c 
char *src = "hello";
char *dst = (char *) malloc(strlen(src));  // 너무 작음
strcpy(dst, src);
```

#### 할당받은 메모리 초기화하지 않기

`malloc()` 하면 할당 받은 데이터 타입에 특정 값을 넣어야 한다.  
초기화하지 않으면 프로그램은 **초기화되지 않은 읽기(uninitialized read)** 로 힙으로부터 알 수 없는 값을 읽을 수 있다.


#### 메모리 해제하지 않기

메모리 해제를 잊었을 때 **메모리 누수(memory leak)** 가 발생된다.  
메모리 청크 사용이 끝나면 반드시 해제해야 한다.  
한 바이트라도 할당받았으면 해제하는 습관이 중요하다.  

#### 메모리 사용이 끝나기 전에 메모리 해제하기

메모리 사용이 끝나기전에 메모리를 해제하는 것은 `dangling pointer` 라고 하며 심각한 실수다.  
이후에 이 포인터를 이용하면 프로그램을 크래시 시키거나 메모리 영역을 덮어쓸 수 있다.  

#### 반복적으로 메모리 해제하기 

메모리를 한번 이상 해제하는 경우를 이중 해제(double free) 라고 한다.  
크래시 같은 다양한 문제를 일으킬 수 있다.

#### free() 잘못 호출하기

`malloc()` 을 호출한 포인터가 아닌 다른 값을 `free()` 에 전달하면 **유효하지 않은 해제(invalid frees)** 가 발생된다.


### 14.5 운영체제의 지원

`malloc()` 과 `free()` 는 시스템콜이 아니라 라이브러리 함수다.  
`malloc` 라이브러리가 가상 주소 공간 안의 공간을 관리하지만 시스템에게 더 많은 메모리를 요구하고 반환하는 시스템 콜을 기반으로 구축된다.  

이러한 시스템 콜 중 하나가 `brk` 시스템 콜로 프로그램의 `break` 위치를 힙의 마지막 위치로 변경하는데 사용된다.  

또한, `mmap()` 함수를 사용하여 `anonymous` 의 메모리 영역을 만들어 메모리를 얻을수도 있다.  
`anonymous` 영역은 특정 파일과 연결되어 있지 않고 스왑 공간(swap space)에 연결된 영역이다.  


### 14.6 기타함수들

- `calloc()`
  - 메모리 할당 영역을 0으로 채워 반환
  - 초기화 하는 것을 잊어버리는 오류 방지
- `realloc()`
  - 할당된 공간에 대해 추가 공간이 필요할 때 유용
  - 이전 영역의 내용을 복사하여 더 큰 새로운 영역을 확보하고 포인터 반환


<br/>

## 15장. 주소 변환의 원리

메모리 가상화에서는 효율성(efficiency) 와 제어(control) 을 추구한다.  
여기서 다루는 기법은 **하드웨어 기반 주소 변환(hardware-based address translation)** 또는 **주소 변환(address translation)** 이다. 
주소 변환을 통해 하드웨어는 가상 주소를 물리 주소로 변환한다.  

- 효율성(efficiency)
  - 하드웨어 지원 활용 (몇 개의 레지스터부터 TLB, 페이지 테이블 등)

- 제어(control)
  - 응용 프로그램이 다른 메모리에 접근하지 못함

- 유연성(flexibility)
  - 원하는 대로 주소 공간을 사용하고 쉬운 시스템을 만들기 원함


### 15.1 가정

사용자 주소 공간은 물리 메모리에 연속적으로 배치된다고 가정한다.  


### 15.2 사례

다음과 같은 프로세스가 있다고 가정한다.  

```c 
void func() {
    int x = 3000;
    x = x + 3;      // 우리가 관심있는 코드
}
```

어셈블리로 변경하변 다음과 같다.  

```text
128: movl 0x0(\%ebx), \%eax  ;  0+ebx 를 eax에 저장
132: addl $0x3, \%eax       ;  eax 레지스터에 3을 더함
136: movl \%eax, 0x0(\%ebx) ;  eax를 0+ebx에 저장
```

{% include image.html alt="프로세스와 주소 공간" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/process-address-space.png" %}

세 개 명령어의 코드는 주소 128에 위치(상단 코드 섹션),  
변수 x 의 값은 주소 15KB(아래쪽 스택) 에 위치한다.  
메모리 접근은 다음과 같이 이루어진다. 

- 주소 128의 명령어를 반입
- 명령어 실행(주소 15KB 에서 탑재)
- 주소 132의 명령어 반입
- 명령어 실행(메모리 참조 없음)
- 주소 135 명령어 반입
- 명령어 실행(15KB 에 저장)

프로그램 관점에서 주소 공간은 0부터 최대 16KB 까지다.  
다른 물리 주소에 배치되어 있을 때, 주소 0번지부터 시작하는 가장 주소 공간을 제공하는 방법에 대해 알아본다.


### 15.3 동적(하드웨어 기반) 재배치

주소 변환을 이해하기 위해 시분할 컴퓨터에서 **베이스와 바운드(base and bound)** 또는 **동적 재배치(dynamic relocation)** 라고 부르는 기술을 알아본다.  

{% include image.html alt="재배치된 프로세스를 가진 물리 메모리" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/relocated-process-physical-memory.png" %}

각 CPU 마다 2개의 하드웨어 레지스터가 필요하다.  
**베이스(base)** 레지스터와 **바운드(bound)** 레지스터 혹은 **한계(limit)** 레지스터라고 한다.   
베이스와 바운드 쌍은 원하는 위치에 주소 공간에 접근한다는 것을 보장한다.  

프로그램 시작 시, 탑재될 물리 메모리 위치를 정하고 베이스 레지스터를 그 주소로 지정한다.  
위 이미지의 경우 프로세스를 물리 주소 32KB 에 저장하고 베이스 레지스터 값도 32KB 으로 지정하는 것이다. 

프로세스에 의해 생성되는 주소는 다음과 같은 방법으로 프로세서에 의해 변환된다.

```text 
physical address = virtual address + base
```

프로세스가 생성하는 메모리 참조는 가상 주소다.  
하드웨어는 베이스 레지스터의 내용을 가상 주소에 더해 물리 주소를 생성한다.  

```text
128: movl 0x0(\%ebx), \%eax
```
즉, 프로그램 카운터(PC) 는 128 로 설정되고 베이스 레지스터를 32KB(32768) 을 더하면 32896 이 물리 주소를 얻는다.  
이처럼 가상 주소에서 물리 주소로 변환하는 기술을 **주소 변환(address translation)** 부른다.  

하드웨어는 가상 주소를 받아들여 물리 주소를 변환하는데  
이 주소의 재배치는 실행시에 일어나고 주소 공간을 이동할수도 있기 때문에 **동적 재배치(dynamic relocation)** 라고도 불린다.

**바운드 레지스터** 는 가상 주소가 바운드 안에 있는지 확인하고 보호를 지원하기 위해 존재한다.   
프로세스가 바운드보다 크거나 음수인 가상 주소를 참조하면 CPU 는 예외를 발생시킨다.  
위 이미지에서는 바운드 레지스터는 항상 16KB 로 설정된다.  

베이스와 바운드 레지스터는 CPU 칩상에 존재하는 하드웨어 구조다.(CPU 당 1쌍)  
주소 변환에 도움을 주는 프로세서의 일부는 **메모리 관리 장치(memory management unit, MMU)** 라고 불린다.


#### 예제 

주소 공간 크기가 4KB 인 프로세스가 물리 주소 16KB 에 탑재되어 있다면 주소 변환은 다음과 같다.  

{% include image.html alt="주소 변환 예제" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/virtual-address-space-example.png" %}

### 15.4 하드웨어 지원: 요약 

{% include image.html alt="동적 재배치: 하드웨어 요구사항" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/dynamic-relocation-hardware-requirements.png" %}

### 15.5 운영체제 이슈

베이스와 바운드 방식의 가상 메모리 구현을 위해 운영체제가 개입되어야 하는 세 개의 시점

1. 프로세스가 생성될 때 운영체제는 주소 공간이 저장될 메모리 공간을 찾아 조치 필요
   - 프로세스의 각 주소 공간은 물리 메모리의 크기보다 작고, 크기가 일정하다는 가정이라면 운영체제가 쉽게 처리 가능
   - 프로세스가 생성되면 주소 공간 할당에 필요한 영역인 빈 공간 리스트(free list) 자료 구조 검색
2. 프로세스가 종료되거나 죽게될 때 사용하던 메모리를 회수하여 사용할 수 있어야 함
   - 운영체제는 종료한 프로세스의 메모리를 다시 빈 공간 리스트에 넣고 연관된 자료 구조 정리
3. 문맥 교환이 일어날 때에도 추가 조치 필요
   - 프로세스를 중단시키기로 결정하면 메모리에 있는 프로세스 별 자료 구조 안에 베이스와 바운드 레지스터의 값 저장 
     - 이 자료구조는 **프로세스 구조체(process structure)** 또는 **프로세스 제어 블럭(process control block, PCB)** 라고 함
   - 프로세스 중지하고 새 위치로 주소 공간을 복사, 베이스 레지스터를 갱신하여 새 위치를 가리키도록 하여 프로세스 실행 재개 
4. 운영체제는 예외 핸들러 또는 호출될 함수 제공 필요
   - 에외가 발생할 때 조치를 취할 준비가 되어 있어야 함
   - 불법 행위를 한 프로세스를 종료 시킴

<br/>

## 16장. 세그멘테이션

프로세스 주소 공간 전체를 메모리에 탑재하면 스택과 힙 사이에 사용되지 않는 큰 공간이 존재한다.    
그러므로 베이스와 바운드 레지스터 방식은 메모리 낭비가 심하다.  

### 16.1 세그멘테이션: 베이스/바운드(base/bound) 의 일반화

{% include image.html alt="세그먼트 레지스터의 값" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/segment-register-value.png" %}

메모리 낭비 문제를 해결하기 위해 **세그멘테이션(segmentation)** 이 도입되었다.  
세그멘테이션은 MMU에 하나의 베이스와 바운드 값이 존재하는 것이 아닌 **세그멘트(segment)** 마다 베이스와 바운드 값이 존재한다.  
세그멘트는 특정 길이를 가지는 연속적인 주소 공간으로 코드, 스택, 및 힙의 세 종류의 세그먼트가 있다.  
세그멘테이션을 통해 각 세그멘트를 물리 메모리의 각기 다른 위치에 배치할 수 있으며, 사용되지 않는 공간의 물리 메모리 낭비를 방지할 수 있다.  
위 그림과 같이 사용중인 메모리에만 물리 공간이 할당된다.  

만일 세그멘트의 마지막을 벗어난 주소에 접근한다면 운영체제는 프로세스를 종료시킬 것이다. **(세그먼트 폴트, segment fault)**

### 16.2 세그먼트 종류의 파악

{% include image.html alt="세그먼트 주소 공간" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/segment-offset.png" %}

하드웨어는 변환을 위해 **세그먼트 레지스터**를 사용한다.  
일반적으로 가상 주소의 **최상위 비트 몇 개를 세그먼트 종류**를 나타낸다. (VAX/VMS 시스템에서 사용)  
세그먼트 종류를 표시하기 위해 2비트를 사용한다면 가상 주소 공간은 위와 같이 보일 것이다.  

세그먼트 레지스터를 파악하고 오프셋에 베이스 레지스터 값을 더하면 최종 물리 주소를 얻을 수 있다.  
오프셋은 바운드보다 작은지 검사만 하면 되므로 바운드 검사도 간단하다.   
하지만 상위 몇 비트를 사용하여 세그먼트 종류를 표시하기 때문에 가상 **주소 공간의 활용이 제한**된다.  

세그멘트를 파악하는 다른 방법으로 **묵시적(implicit)** 접근 방식도 있다.  
주소가 어떻게 형성되었나 관찰하여 세그멘트를 결정하는 방식이다.  

### 16.3 스택

'세그먼트 레지스터의 값' 그림에서 스택은 다른 세그먼트들과 다르게 반대 방향으로 확장된다. (낮은 주소 방향)  
다른 방식의 변환이 필요하다.  

{% include image.html alt="세그먼트 레지스터(반대 방향 확장 지원 기능 포함)" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/segment-register-direction.png" %}

- 추가로 간단한 하드웨어 필요
  - 베이스와 바운드 값 뿐만 아니라 세그먼트가 어느 방향으로 확장되는지 알아야 함


### 16.4 공유 지원

{% include image.html alt="세그먼트 레지스터 값(보호 정보 포함)" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/segment-register-protection.png" %}

메모리를 절약하기 위해 주소 공간들 간에 특정 메모리 세그멘트(특히 코드)를 공유하는 것이 좋다.  
공유를 위해 하드웨어에 **protection bit** 가 추가로 필요하다.  

이 값으로 읽기, 쓰기, 실행 가능 여부를 확인할 수 있다.  
읽기 전용으로 설정하면 독립성을 유지하며, 주소 공간 일부를 공유할 수 있다.  


### 16.5 소단위 대 대단위 세그멘테이션

 이라고 부른다.  
되면  라고 할 수 있다.  

- **대단위(carse-grained)** 세그멘테이션
  - 비교적 큰 단위의 공간으로 분할

- **소단위(fine-grained)** 세그멘테이션
  - 초기 시스템은 주소 공간을 작은 크기의 공간으로 잘게 나누는 것이 허용되어 소단위 세그멘테이션라고 부름

- **세그멘트 테이블**
  - 많은 수의 세그멘트를 지원하기 위해 세그멘트의 정보를 메모리에 저장
  - 세그먼트를 쉽게 생성하고 융통성있게 사용할 수 있도록 도와주는 하드웨어


### 16.6 운영체제의 지원 

시스템이 세그먼트 단위로 가상 주소 공간을 물리 메모리에 재배치하여 물리 메모리를 절약할 수 있다.  
세그멘테이션의 도입을 위해 운영체제는 다음과 같은 문제들을 해결해야 한다.  

{% include image.html alt="압축 전과 압축 후의 메모리 상태" source_txt='운영체제 아주 쉬운 세가지 이야기' path="/images/study/operating-system/segment-register-compact.png" %}

- 문맥교환
  - 세그멘트 레지스터의 저장과 복원을 올바르게 설정해야 함
- 세그먼트 크기 변경
  - 빈 공간이 없다면 세그먼트의 크기를 증가해야 함
  - 과도하게 많은 메모리를 사용중이라면 할당 요청을 거절할 수 있음
- 미사용 중인 물리 메모리 공간의 관리
  - 새로운 주소 공간이 생성되면 세그멘트를 위한 비어있는 물리 메모리 영역을 찾을 수 있어야 함
  - 세그멘트에 할당 또는 확장하기에도 도움 되지 않는 작은 빈 공간들로 인한 문제를 **외부 단편화(external fragmentation)** 라고 함
    - 문제 해결을 위해 기존 세그멘트를 정리하여 물리 메모리 **압축(compact)** 함 (비용이 많이 든다)
  - 빈 공간 리스트를 관리하느 알고리즘으로 **최초 적합(first-fit)**, **최적 적합(best-fit)**, **최악 적합(worst-fit)**, **버디 알고리즘(buddy algorithm)** 등이 있음


### 16.7 요약

세그멘테이션은 메모리 가상화를 효과적으로 실현할 수 있다.  
하지만 다음과 같은 문제들이 존재한다.  

- 외부 단편화
  - 가변 크기이기 때문에 메모리 할당 요청을 충족하기 어려움
- 세그멘테이션이 드문드문 사용되는 주소 공간을 지원할 만큼 유연하지 못함
  - 주소 공간이 사용되는 모델과 이를 위한 세그멘테이션 설계 방법이 일치하지 않으면 제대로 동작하지 않음
