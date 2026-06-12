// Generated from the original cpp-learn lesson catalog during the static-site refactor.
window.CPP_LESSONS = [
  {
    id: 1,
    title: 'C++ 编译模型与入口函数',
    difficulty: '基础',
    estimatedMinutes: 8,
    goals: ['定义 main 函数入口', '使用标准输出流', '正常退出程序'],
    hint: '在 main 函数中，通过 std::cout 和 std::endl 输出指定的字符串，最后返回 0。',
    expectedOutput: 'Hello, C++ World!',
    tutorial: `# 第 1 章：C++ 编译模型与入口函数 🚀

C++ 是一门编译型语言，具有高效的硬件控制能力与强大的抽象能力。在运行 C++ 代码前，源码需要经过编译器的流水线处理。

### 编译流水线阶段

1. **预处理 (Preprocessing)**：处理所有以 \`#\` 开头的预处理指令，例如解析 \`#include\` 展开头文件，进行宏替换等。
2. **编译 (Compilation)**：将预处理后的源码进行语法与语义分析，翻译成平台相关的汇编语言文件。
3. **汇编 (Assembly)**：将汇编代码翻译为机器能直接执行的二进制目标文件 (\`.obj\` 或 \`.o\` 等)。
4. **链接 (Linking)**：将多个二进制目标文件与所依赖的系统标准库合并，重定位地址，最终生成可执行程序。

### 核心要素说明

- \`#include <iostream>\`：引入标准输入输出流头文件，包含输出对象 \`std::cout\`。
- \`int main()\`：程序的唯一主入口函数，程序启动时从此函数第一行开始执行。
- \`std::cout << "..."\`：向标准输出控制台写入字符流。
- \`std::endl\`：换行并强制刷新缓冲区，确保输出即时显示。
- \`return 0;\`：返回状态码给操作系统，\`0\` 表示程序正常退出。

### 实战挑战

补全右侧代码，使其输出以下字符串：
\`\`\`cpp
std::cout << "Hello, C++ World!" << std::endl;
\`\`\``,
    starterCode: `#include <iostream>

int main() {
    // TODO: 输出 Hello, C++ World!

    return 0;
}
`,
    answerCode: `#include <iostream>

int main() {
    std::cout << "Hello, C++ World!" << std::endl;
    return 0;
}
`,
  },
  {
    id: 2,
    title: '变量、内存与类型系统',
    difficulty: '基础',
    estimatedMinutes: 10,
    goals: ['声明并修改不同类型的变量', '使用 sizeof 测定数据类型大小', '格式化输出变量值'],
    hint: '先将 age 赋为 18，score 赋为 96.5，再通过 std::cout 按要求格式输出它们的值和 sizeof(int)。',
    expectedOutput: 'age = 18\nscore = 96.5\nsizeof(int) = 4 bytes',
    tutorial: `# 第 2 章：变量、内存与类型系统 💾

在 C++ 中，变量是具有名称的特定内存区域。每个变量都必须声明确定的数据类型，以决定其占用的内存大小和支持的操作。

### 核心概念与机制

- **强类型系统**：C++ 要求所有变量在编译期必须具备确定类型，类型一旦声明，在生命周期内无法更改，这在编译阶段保证了类型安全。
- **内存占用与大小**：不同类型占用的字节数不同。例如在多数现代系统上，\`int\` 占用 4 字节，\`double\` 占用 8 字节。
- **\`sizeof\` 运算符**：在编译期求出某个数据类型或变量在内存中所占用的字节（byte）数。

\`\`\`cpp
int age = 18;
double score = 96.5;
\`\`\`

### 实战挑战

在右侧代码中，完成以下操作：
1. 将 \`age\` 赋值为 \`18\`，将 \`score\` 赋值为 \`96.5\`。
2. 使用 \`std::cout\` 依次输出以下格式的内容：
\`\`\`text
age = 18
score = 96.5
sizeof(int) = 4 bytes
\`\`\``,
    starterCode: `#include <iostream>

int main() {
    int age = 0;
    double score = 0.0;

    // TODO: 修改变量并输出结果

    return 0;
}
`,
    answerCode: `#include <iostream>

int main() {
    int age = 18;
    double score = 96.5;

    std::cout << "age = " << age << std::endl;
    std::cout << "score = " << score << std::endl;
    std::cout << "sizeof(int) = " << sizeof(int) << " bytes" << std::endl;

    return 0;
}
`,
  },
  {
    id: 3,
    title: '流程控制与函数深度剖析',
    difficulty: '基础',
    estimatedMinutes: 12,
    goals: ['声明并实现自定义累加函数', '使用 for 循环结构实现累加算法', '返回计算结果并输出'],
    hint: '在 sumTo 中，使用一个循环从 1 累加到 n 并将结果返回；当 n 值为 0 时应直接返回 0。',
    expectedOutput: '55',
    defaultStdin: '10',
    testCases: [
      {
        id: 'sum-10',
        title: 'n = 10',
        stdin: '10',
        expectedOutput: '55',
      },
      {
        id: 'sum-5',
        title: 'n = 5',
        stdin: '5',
        expectedOutput: '15',
      },
      {
        id: 'sum-zero',
        title: 'n = 0',
        stdin: '0',
        expectedOutput: '0',
        note: '边界示例：n 为 0 时。',
      },
    ],
    tutorial: `# 第 3 章：流程控制与函数深度剖析 🔀

合理的流程控制可以实现复杂的程序分支与循环计算，而函数则用于实现代码逻辑的封装和复用。

### 核心机制

- **\`if\` 条件控制**：通过布尔表达式决定代码执行分支。
- **\`for\` 循环**：用于在已知循环次数时重复执行指定代码块。
- **函数结构**：包含返回类型、函数名、参数列表和函数体。
\`\`\`cpp
// 返回类型 函数名(参数)
int add(int a, int b) {
    return a + b;
}
\`\`\`

### 实战挑战

完善右侧的 \`sumTo\` 函数，使其计算从 \`1\` 到 \`n\` 的正整数累加和并返回。
- 若 \`n = 5\`，应返回 \`15\`（即 1 + 2 + 3 + 4 + 5）。
- 注意边界处理：当 \`n = 0\` 时，应当返回 \`0\`。`,
    starterCode: `#include <iostream>

int sumTo(int n) {
    // TODO: 返回 1 到 n 的和
    return 0;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << sumTo(n) << std::endl;
    return 0;
}
`,
    answerCode: `#include <iostream>

int sumTo(int n) {
    int total = 0;
    for (int i = 1; i <= n; ++i) {
        total += i;
    }
    return total;
}

int main() {
    int n = 0;
    std::cin >> n;
    std::cout << sumTo(n) << std::endl;
    return 0;
}
`,
  },
  {
    id: 4,
    title: '类与对象：封装的本质',
    difficulty: '进阶',
    estimatedMinutes: 13,
    goals: ['理解 private 成员访问限制', '实现公有行为修改私有数据', '声明只读的 const 成员函数'],
    hint: '在 Counter 类中，实现 increment() 累加，以及只读方法 get() const。',
    expectedOutput: '2',
    defaultStdin: '2',
    testCases: [
      {
        id: 'counter-two',
        title: '加两次',
        stdin: '2',
        expectedOutput: '2',
      },
      {
        id: 'counter-zero',
        title: '不加',
        stdin: '0',
        expectedOutput: '0',
        note: '边界示例：初始值。',
      },
      {
        id: 'counter-five',
        title: '加五次',
        stdin: '5',
        expectedOutput: '5',
      },
    ],
    tutorial: `# 第 4 章：类与对象：封装的本质 🏗️

封装是面向对象编程的三大特性之一，旨在将数据成员与成员函数绑定在一起，限制对内部实现细节的直接访问。

### 封装的核心要素

- **访问控制级别**：
  - **\`private\`**：私有成员，只能被类内部的成员函数访问，保护数据免受外部非法篡改。
  - **\`public\`**：公有成员，构成类对外提供的操作接口。
- **\`const\` 成员函数**：在函数签名末尾加上 \`const\`，表示该方法不会修改类的任何非静态数据成员，增强了代码的只读安全性。

### 实战挑战

请在右侧代码中实现 \`Counter\` 类：
1. 完善 \`increment()\` 函数，每次调用使私有数据 \`value\` 自增 \`1\`。
2. 完善 \`get()\` 成员函数，声明为 \`const\`，并返回当前的 \`value\`。`,
    starterCode: `#include <iostream>

class Counter {
private:
    int value;

public:
    Counter() : value(0) {}

    void increment() {
        // TODO
    }

    int get() const {
        // TODO
        return 0;
    }
};

int main() {
    Counter counter;
    int steps = 0;
    std::cin >> steps;

    for (int i = 0; i < steps; ++i) {
        counter.increment();
    }

    std::cout << counter.get() << std::endl;
    return 0;
}
`,
    answerCode: `#include <iostream>

class Counter {
private:
    int value;

public:
    Counter() : value(0) {}

    void increment() {
        ++value;
    }

    int get() const {
        return value;
    }
};

int main() {
    Counter counter;
    int steps = 0;
    std::cin >> steps;

    for (int i = 0; i < steps; ++i) {
        counter.increment();
    }

    std::cout << counter.get() << std::endl;
    return 0;
}
`,
  },
  {
    id: 5,
    title: '继承、多态与虚函数表',
    difficulty: '进阶',
    estimatedMinutes: 14,
    goals: ['公有继承 Animal 基类', '利用 override 重写虚函数', '在析构函数上定义 virtual'],
    hint: 'Dog 继承 Animal，重写 speak 并使用 override，输出 dog。',
    expectedOutput: 'dog',
    tutorial: `# 第 5 章：继承、多态与虚函数表 🐕

**多态 (Polymorphism)** 允许我们使用基类的指针或引用来调用派生类中实现的同名虚函数，并在运行时决定实际执行的代码（动态绑定）。

### 多态的工作原理

- **\`virtual\` 关键字**：将基类中的函数声明为虚函数，启用动态派发。
- **虚函数表 (vtable)**：编译器为每个含有虚函数的类创建虚函数表。每个类实例中包含一个指向其类虚表的指针（vptr），运行时通过虚表查询并调用实际重写的函数。
- **\`override\` 说明符**：明确指示该函数重写了基类的虚函数，让编译器帮助检查参数签名是否完全匹配。
- **虚析构函数**：如果类需要被多态继承，基类的析构函数必须声明为 \`virtual\`，否则通过基类指针销毁子类对象时会导致子类析构函数未被调用，引发内存泄漏。

### 实战挑战

请在右侧代码中完成以下任务：
1. 让子类 \`Dog\` 继承自基类 \`Animal\`。
2. 重写 \`speak()\` 函数，输出 \`dog\`，并使用 \`override\` 关键字。`,
    starterCode: `#include <iostream>

class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() const {
        std::cout << "animal" << std::endl;
    }
};

class Dog : public Animal {
public:
    // TODO: override speak
};

int main() {
    Dog dog;
    const Animal& animal = dog;
    animal.speak();
    return 0;
}
`,
    answerCode: `#include <iostream>

class Animal {
public:
    virtual ~Animal() = default;
    virtual void speak() const {
        std::cout << "animal" << std::endl;
    }
};

class Dog : public Animal {
public:
    void speak() const override {
        std::cout << "dog" << std::endl;
    }
};

int main() {
    Dog dog;
    const Animal& animal = dog;
    animal.speak();
    return 0;
}
`,
  },
  {
    id: 6,
    title: '内存管理：从指针到 RAII',
    difficulty: '进阶',
    estimatedMinutes: 12,
    goals: ['理解作用域自动销毁原则', '使用范围 for 循环遍历容器', '利用 std::vector 管理堆资源'],
    hint: '遍历 values，累加到 total 并输出。',
    expectedOutput: '15',
    defaultStdin: '5\n1 2 3 4 5',
    testCases: [
      {
        id: 'sum-vector-default',
        title: '五个正数',
        stdin: '5\n1 2 3 4 5',
        expectedOutput: '15',
      },
      {
        id: 'sum-vector-empty',
        title: '空集合',
        stdin: '0',
        expectedOutput: '0',
        note: '边界示例：空集合。',
      },
      {
        id: 'sum-vector-mixed',
        title: '混合整数',
        stdin: '4\n-3 7 -2 5',
        expectedOutput: '7',
      },
    ],
    tutorial: `# 第 6 章：内存管理：从指针到 RAII 📦

C++ 允许直接操作内存，但手动分配堆内存容易导致泄漏。**RAII (Resource Acquisition Is Initialization)** 是 C++ 管理资源的黄金法则。

### 核心设计原则

- **生命周期绑定**：在构造函数中获取资源，在析构函数中释放资源。
- **自动释放**：局部变量会在离开作用域（即遇到大括号 \`}\`）时被自动销毁，自动调用其析构函数，从而保证资源（如堆内存、文件描述符、互斥锁）被安全回收。
- **\`std::vector\` 容器**：标准库的动态数组，本身即为 RAII 对象，它在内部自动管理堆内存的申请与释放，比裸指针 \`new/delete\` 更安全。

### 实战挑战

完善右侧代码，实现输入数组的求和：
- 使用范围 for 循环（\`for (int value : values)\`）遍历数组，计算所有元素的累加和并存入 \`total\`。`,
    starterCode: `#include <iostream>
#include <vector>

int main() {
    int count = 0;
    std::cin >> count;

    std::vector<int> values(count);
    for (int& value : values) {
        std::cin >> value;
    }

    int total = 0;

    // TODO: 累加 values

    std::cout << total << std::endl;
    return 0;
}
`,
    answerCode: `#include <iostream>
#include <vector>

int main() {
    int count = 0;
    std::cin >> count;

    std::vector<int> values(count);
    for (int& value : values) {
        std::cin >> value;
    }

    int total = 0;

    for (int value : values) {
        total += value;
    }

    std::cout << total << std::endl;
    return 0;
}
`,
  },
  {
    id: 7,
    title: '智能指针：生命周期托管',
    difficulty: '进阶',
    estimatedMinutes: 12,
    goals: ['理解 unique_ptr 独占资源所有权', '使用 std::make_unique 安全创建对象', '通过 -> 访问对象公有行为'],
    hint: '使用 std::make_unique 创建 Widget，然后调用 render()。',
    expectedOutput: 'render widget',
    tutorial: `# 第 7 章：智能指针：生命周期托管 🛡️

为了彻底摆脱手动 \`delete\` 的不安全性，现代 C++ 提供了智能指针，通过明确的所有权语义来自动管理堆内存。

### 核心智能指针

1. **\`std::unique_ptr\`（独占智能指针）**：
   - 保证同一时间只有一个指针拥有堆对象的所有权。
   - 无法被复制，只能通过 \`std::move\` 将所有权转移。
   - 当其自身离开作用域被销毁时，会自动释放所托管的内存资源。
2. **\`std::shared_ptr\`（共享智能指针）**：
   - 使用引用计数管理生命周期，允许多个指针共享同一块堆内存。
   - 仅在最后一个持有者销毁、计数归零时才会释放底层内存。
3. **安全创建**：优先使用 \`std::make_unique<T>()\`，避免手写 \`new\`，提升内存安全性。

### 实战挑战

请在右侧代码中，使用智能指针管理 \`Widget\` 对象：
1. 利用 \`std::make_unique\` 创建一个 \`Widget\` 对象的独占指针，命名为 \`widget\`。
2. 通过该智能指针调用 \`Widget\` 的 \`render()\` 函数。`,
    starterCode: `#include <iostream>
#include <memory>

class Widget {
public:
    void render() const {
        std::cout << "render widget" << std::endl;
    }
};

int main() {
    // TODO: 使用 std::make_unique 创建 Widget

    return 0;
}
`,
    answerCode: `#include <iostream>
#include <memory>

class Widget {
public:
    void render() const {
        std::cout << "render widget" << std::endl;
    }
};

int main() {
    auto widget = std::make_unique<Widget>();
    widget->render();
    return 0;
}
`,
  },
  {
    id: 8,
    title: '右值引用与移动语义',
    difficulty: '挑战',
    estimatedMinutes: 15,
    goals: ['理解右值引用与 std::move', '接管指针并重置原对象指针', '利用移动语义避免大对象拷贝'],
    hint: '实现移动构造函数，接管 other.data，并将 other.data 赋值为 nullptr。',
    expectedOutput: 'moved\n5',
    defaultStdin: '5',
    testCases: [
      {
        id: 'move-five',
        title: '移动验证 5',
        stdin: '5',
        expectedOutput: 'moved\n5',
      },
      {
        id: 'move-ten',
        title: '移动验证 10',
        stdin: '10',
        expectedOutput: 'moved\n10',
      },
    ],
    tutorial: `# 第 8 章：右值引用与移动语义 🚀

在 C++ 中，拷贝大型对象（如包含堆内存的资源管理器）开销巨大。**移动语义 (Move Semantics)** 允许我们直接转移资源的所有权，而不是分配新内存并复制数据，从而极大提升性能。

### 核心机制

- **左值 (Lvalue)**：具有持久内存地址、可以通过名称访问的对象（如变量 \`rm1\`）。
- **右值 (Rvalue)**：临时的、即将被销毁的无名对象（如函数返回值或临时字面量）。
- **右值引用 (\`T&&\`)**：绑定到右值的引用类型，允许修改右值以夺取其资源。
- **\`std::move\`**：并不移动任何东西，只是将左值强制转换为右值引用，从而允许编译器调用移动构造函数或移动赋值运算符。

### 移动构造函数实现要点

移动构造函数形式为 \`ClassName(ClassName&& other) noexcept\`：
1. **接管资源**：直接复制 \`other\` 的指针到当前对象。
2. **资源置空**：将 \`other\` 的原始指针置为 \`nullptr\`。这是为了防止 \`other\` 析构时将刚刚转移出去的堆资源释放掉（导致野指针和双重释放崩溃）。
3. **\`noexcept\` 声明**：移动操作通常不会抛出异常，加上 \`noexcept\` 可以让 STL 容器（如 \`std::vector\`）在扩容时安心使用高效的移动构造，而不是回退到慢速的拷贝构造。

### 实战挑战

请在右侧代码中，为 \`ResourceManager\` 实现移动构造函数，完成以下任务：
1. 将 \`other.data\` 赋给当前对象的 \`data\` 指针。
2. 将 \`other.data\` 赋值为 \`nullptr\`。`,
    starterCode: `#include <iostream>
#include <utility>

class ResourceManager {
public:
    int* data;

    ResourceManager(int value) {
        data = new int(value);
    }

    ~ResourceManager() {
        delete data;
    }

    // 拷贝构造函数（深拷贝）
    ResourceManager(const ResourceManager& other) {
        data = new int(*other.data);
    }

    // TODO: 实现移动构造函数
    // 提示：接管 other 的资源，并将 other.data 置空以防析构释放
    ResourceManager(ResourceManager&& other) noexcept {
    }
};

int main() {
    int val = 0;
    std::cin >> val;

    ResourceManager rm1(val);
    // 使用 std::move 触发移动构造
    ResourceManager rm2(std::move(rm1));

    if (rm1.data == nullptr) {
        std::cout << "moved" << std::endl;
    }
    if (rm2.data != nullptr) {
        std::cout << *rm2.data << std::endl;
    }
    return 0;
}
`,
    answerCode: `#include <iostream>
#include <utility>

class ResourceManager {
public:
    int* data;

    ResourceManager(int value) {
        data = new int(value);
    }

    ~ResourceManager() {
        delete data;
    }

    // 拷贝构造函数（深拷贝）
    ResourceManager(const ResourceManager& other) {
        data = new int(*other.data);
    }

    // 移动构造函数
    ResourceManager(ResourceManager&& other) noexcept {
        data = other.data;
        other.data = nullptr;
    }
};

int main() {
    int val = 0;
    std::cin >> val;

    ResourceManager rm1(val);
    ResourceManager rm2(std::move(rm1));

    if (rm1.data == nullptr) {
        std::cout << "moved" << std::endl;
    }
    if (rm2.data != nullptr) {
        std::cout << *rm2.data << std::endl;
    }
    return 0;
}
`,
  },
  {
    id: 9,
    title: '模板编程与泛型艺术',
    difficulty: '进阶',
    estimatedMinutes: 14,
    goals: ['声明 template 函数模板', '根据入参类型推导泛型参数', '在编译期实例化对应重载'],
    hint: '实现 maximum 函数模板，使用 a > b ? a : b 比较。',
    expectedOutput: '7\n2.5',
    defaultStdin: '3 7\n2.5 1.5',
    testCases: [
      {
        id: 'max-default',
        title: '默认比较',
        stdin: '3 7\n2.5 1.5',
        expectedOutput: '7\n2.5',
      },
      {
        id: 'max-reversed',
        title: '反向比较',
        stdin: '9 4\n1.25 3.75',
        expectedOutput: '9\n3.75',
      },
    ],
    tutorial: `# 第 9 章：模板编程与泛型艺术 🎨

C++ 模板（Template）提供了一种将“类型参数化”的泛型编程机制，允许我们编写独立于具体数据类型的算法和容器。

### 模板的工作机制

- **编译期实例化**：当调用模板函数时，编译器会根据实际传入的参数类型，在编译阶段自动生成对应类型的具体函数实现（实例化）。这意味着模板在运行时没有任何性能开销。
- **语法定义**：使用 \`template <typename T>\` 声明泛型占位符 \`T\`。

\`\`\`cpp
template <typename T>
T maximum(T a, T b) {
    return a > b ? a : b;
}
\`\`\`

### 实战挑战

请在右侧代码中，实现泛型 \`maximum\` 函数模板：
- 比较两个同类型参数 \`a\` 和 \`b\`，返回它们之中的较大者。`,
    starterCode: `#include <iostream>

template <typename T>
T maximum(T a, T b) {
    // TODO
    return a;
}

int main() {
    int firstInt = 0;
    int secondInt = 0;
    double firstDouble = 0.0;
    double secondDouble = 0.0;

    std::cin >> firstInt >> secondInt;
    std::cin >> firstDouble >> secondDouble;

    std::cout << maximum(firstInt, secondInt) << std::endl;
    std::cout << maximum(firstDouble, secondDouble) << std::endl;
    return 0;
}
`,
    answerCode: `#include <iostream>

template <typename T>
T maximum(T a, T b) {
    return a > b ? a : b;
}

int main() {
    int firstInt = 0;
    int secondInt = 0;
    double firstDouble = 0.0;
    double secondDouble = 0.0;

    std::cin >> firstInt >> secondInt;
    std::cin >> firstDouble >> secondDouble;

    std::cout << maximum(firstInt, secondInt) << std::endl;
    std::cout << maximum(firstDouble, secondDouble) << std::endl;
    return 0;
}
`,
  },
  {
    id: 10,
    title: 'STL 容器：数据结构的工业实现',
    difficulty: '进阶',
    estimatedMinutes: 14,
    goals: ['使用 std::map 关联容器', '按键值自动升序排列', '统计输入元素的词频'],
    hint: '读取每一个单词，counts[word]++ 累加统计词频。',
    expectedOutput: 'cpp: 2\nmap: 1\nstl: 1',
    defaultStdin: '4\ncpp stl cpp map',
    testCases: [
      {
        id: 'map-default',
        title: '默认单词',
        stdin: '4\ncpp stl cpp map',
        expectedOutput: 'cpp: 2\nmap: 1\nstl: 1',
      },
      {
        id: 'map-ordered',
        title: '有序输出',
        stdin: '3\nz cpp z',
        expectedOutput: 'cpp: 1\nz: 2',
      },
      {
        id: 'map-repeated',
        title: '多词重复',
        stdin: '5\nraii stl raii map stl',
        expectedOutput: 'map: 1\nraii: 2\nstl: 2',
      },
    ],
    tutorial: `# 第 10 章：STL 容器：数据结构的工业实现 🗃️

C++ 标准模板库 (STL) 提供了经过高度优化的经典数据结构容器，选择合适的容器是编写高性能代码的关键。

### 常用容器及其复杂度

1. **\`std::vector\`（动态数组）**：
   - 内存连续，支持快速随机访问（$O(1)$ 时间复杂度）。
   - 在尾部插入/删除开销小（均摊 $O(1)$），但在中间或头部插入需要移动元素（$O(n)$）。
2. **\`std::map\`（关联映射表）**：
   - 底层由红黑树（自平衡二叉检索树）实现。
   - 所有元素自动按键值升序排列，插入和查找时间复杂度为稳定的 $O(\log n)$。
3. **\`std::unordered_map\`（哈希表）**：
   - 不保留元素顺序。
   - 平均查找和插入时间复杂度为 $O(1)$。

### 实战挑战

请在右侧代码中，使用 \`std::map\` 完成输入单词频次的统计。
- 在循环读取单词时，将对应的单词计数累加。C++ 中 \`std::map\` 的 \`counts[word]++\` 会在键不存在时自动初始化并完成加 1 操作。`,
    starterCode: `#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> counts;
    int count = 0;
    std::cin >> count;

    for (int i = 0; i < count; ++i) {
        std::string word;
        std::cin >> word;
        // TODO: 统计 word
    }

    for (const auto& item : counts) {
        std::cout << item.first << ": " << item.second << std::endl;
    }
    return 0;
}
`,
    answerCode: `#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string, int> counts;
    int count = 0;
    std::cin >> count;

    for (int i = 0; i < count; ++i) {
        std::string word;
        std::cin >> word;
        ++counts[word];
    }

    for (const auto& item : counts) {
        std::cout << item.first << ": " << item.second << std::endl;
    }
    return 0;
}
`,
  },
  {
    id: 11,
    title: '并发编程：多线程与原子操作',
    difficulty: '挑战',
    estimatedMinutes: 15,
    goals: ['理解数据竞争与原子操作', '使用 std::atomic 防止竞争', '利用 fetch_add 安全执行计数'],
    hint: '循环调用 fetch_add(1) 增加 counter 计数值。',
    expectedOutput: '3',
    defaultStdin: '3',
    testCases: [
      {
        id: 'atomic-three',
        title: '三次计数',
        stdin: '3',
        expectedOutput: '3',
      },
      {
        id: 'atomic-zero',
        title: '零次计数',
        stdin: '0',
        expectedOutput: '0',
        note: '边界示例：没有输入。',
      },
      {
        id: 'atomic-six',
        title: '六次计数',
        stdin: '6',
        expectedOutput: '6',
      },
    ],
    tutorial: `# 第 11 章：并发编程与原子操作 ⚡

在多线程并发环境下，当多个线程同时对同一个未受保护的共享变量进行写操作时，会导致不可预测的**数据竞争 (Data Race)** 和未定义行为。

### 原子操作与同步

- **\`std::atomic\`**：提供了硬件级别的原子性保证。原子操作是不可分割的，能确保读取、修改和写入在一步内完成，不会被其他线程中断或打断。
- **免锁同步**：对于基础数据类型，使用 \`std::atomic<T>\` 比传统的互斥锁（\`std::mutex\`）更加轻量，效率更高。

### 实战挑战

请在右侧代码中，实现安全的并发计数操作：
- 对原子类型变量 \`counter\` 循环调用 \`fetch_add(1)\`，以确保计数器的修改在并发状态下也是线程安全的。`,
    starterCode: `#include <atomic>
#include <iostream>

int main() {
    std::atomic<int> counter{0};
    int increments = 0;
    std::cin >> increments;

    for (int i = 0; i < increments; ++i) {
        // TODO: 将 counter 增加一次
    }

    std::cout << counter.load() << std::endl;
    return 0;
}
`,
    answerCode: `#include <atomic>
#include <iostream>

int main() {
    std::atomic<int> counter{0};
    int increments = 0;
    std::cin >> increments;

    for (int i = 0; i < increments; ++i) {
        counter.fetch_add(1);
    }

    std::cout << counter.load() << std::endl;
    return 0;
}
`,
  },
  {
    id: 12,
    title: '现代 C++：结构化绑定与类型推导',
    difficulty: '进阶',
    estimatedMinutes: 13,
    goals: ['使用 auto 让编译器推导类型', '使用结构化绑定快速拆解 pair', '输出解包后的各命名变量'],
    hint: '使用 auto [name, score] = result 结构化绑定，并输出格式。',
    expectedOutput: 'C++ score: 95',
    defaultStdin: 'C++ 95',
    testCases: [
      {
        id: 'pair-cpp',
        title: 'C++ 成绩',
        stdin: 'C++ 95',
        expectedOutput: 'C++ score: 95',
      },
      {
        id: 'pair-raii',
        title: 'RAII 成绩',
        stdin: 'RAII 100',
        expectedOutput: 'RAII score: 100',
      },
      {
        id: 'pair-stl',
        title: 'STL 成绩',
        stdin: 'STL 88',
        expectedOutput: 'STL score: 88',
      },
    ],
    tutorial: `# 第 12 章：现代 C++：结构化绑定与类型推导 🌟

自 C++11 起，C++ 引入了大量现代语法糖，简化了类型声明并极大提升了代码可读性。

### 核心现代语法

- **\`auto\` 类型自动推导**：让编译器在编译阶段根据变量的初始值自动推导其类型。注意不要过度滥用以防降低代码可读性。
- **结构化绑定 (Structured Binding)**：C++17 引入的语法糖，允许用一行代码将数组、结构体、\`pair\` 或 \`tuple\` 拆解为多个独立命名的局部变量。

\`\`\`cpp
std::pair<std::string, int> result = {"C++", 95};
auto [name, score] = result; // 结构化绑定
\`\`\`

### 实战挑战

请在右侧代码中，利用结构化绑定来提取 pair 里的元素：
- 使用结构化绑定语法解包 \`result\`，将其中的课程名称和分数分别绑定到变量 \`name\` 和 \`score\`。`,
    starterCode: `#include <iostream>
#include <string>
#include <utility>

int main() {
    std::string course;
    int value = 0;
    std::cin >> course >> value;

    std::pair<std::string, int> result = {course, value};

    // TODO: 使用结构化绑定取出 name 和 score

    return 0;
}
`,
    answerCode: `#include <iostream>
#include <string>
#include <utility>

int main() {
    std::string course;
    int value = 0;
    std::cin >> course >> value;

    std::pair<std::string, int> result = {course, value};
    auto [name, score] = result;

    std::cout << name << " score: " << score << std::endl;
    return 0;
}
`,
  },
  {
    id: 13,
    title: '实战：构建高性能 C++ 应用',
    difficulty: '挑战',
    estimatedMinutes: 16,
    goals: ['使用 const 引用入参规避深拷贝', '执行前置边界检查避免崩溃', '正确执行类型转换计算均值'],
    hint: '若为空数组返回 0.0，否则累加转 double 除以 size。',
    expectedOutput: '95',
    defaultStdin: '3\n90 95 100',
    testCases: [
      {
        id: 'avg-default',
        title: '三项平均',
        stdin: '3\n90 95 100',
        expectedOutput: '95',
      },
      {
        id: 'avg-empty',
        title: '空数组',
        stdin: '0',
        expectedOutput: '0',
        note: '边界示例：空数组返回 0.0。',
      },
      {
        id: 'avg-even',
        title: '四项平均',
        stdin: '4\n70 80 90 100',
        expectedOutput: '85',
      },
    ],
    tutorial: `# 第 13 章：实战：构建高性能 C++ 应用 🚀

编写高性能 C++ 应用程序不仅依赖于合理的算法，更依赖于对值拷贝开销的控制以及对边界情况的周全处理。

### 高性能实践准则

- **常量引用传递 (\`const T&\`)**：对于体积较大的参数（如 \`std::vector\`、\`std::string\`、大型结构体），在不需要修改内容时应始终通过常量引用传入，避免产生昂贵的堆内存分配与深拷贝。
- **值传递的开销**：如果直接以值形式（\`void func(vector v)\`）传入，编译器会在进入函数时完整复制一份数据，造成不必要的 CPU 和内存浪费。
- **防御性编程**：在执行计算前，应当检查输入边界（如检查容器是否为空 \`values.empty()\`），防止除以零等引发崩溃的非安全行为。

### 实战挑战

实现高性能的 \`average\` 平均值函数：
1. 检查数组是否为空，若为空直接返回 \`0.0\`。
2. 遍历 \`values\`（其以常量引用 \`const std::vector<int>&\` 传入以避免拷贝），计算元素和，最后转换类型计算平均值。`,
    starterCode: `#include <iostream>
#include <vector>

double average(const std::vector<int>& values) {
    // TODO: 返回平均值，空数组返回 0.0
    return 0.0;
}

int main() {
    int count = 0;
    std::cin >> count;

    std::vector<int> scores(count);
    for (int& score : scores) {
        std::cin >> score;
    }

    std::cout << average(scores) << std::endl;
    return 0;
}
`,
    answerCode: `#include <iostream>
#include <vector>

double average(const std::vector<int>& values) {
    if (values.empty()) {
        return 0.0;
    }

    int total = 0;
    for (int value : values) {
        total += value;
    }
    return static_cast<double>(total) / values.size();
}

int main() {
    int count = 0;
    std::cin >> count;

    std::vector<int> scores(count);
    for (int& score : scores) {
        std::cin >> score;
    }

    std::cout << average(scores) << std::endl;
    return 0;
}
`,
  },
];
