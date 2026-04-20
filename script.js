class Simulator {
  constructor() {
    this.currentExample = "sumLoop";
    this.currentStep = -1;
    this.history = [];
    this.outputs = [];
    this.variableKeys = [];
    this.examplesPaths = {
      sumLoop: "exemplos/sumLoop/sumLoop.json",
      factorial: "exemplos/factorial/factorial.json",
      fibonacci: "exemplos/fibonacci/fibonacci.json",
      maxArray: "exemplos/maxArray/maxArray.json",
      ifElse: "exemplos/ifElse/ifElse.json",
      whileLoop: "exemplos/whileLoop/whileLoop.json",
      doWhileLoop: "exemplos/doWhileLoop/doWhileLoop.json",
      switchCase: "exemplos/switchCase/switchCase.json",
      functions: "exemplos/functions/functions.json",
      recursion: "exemplos/recursion/recursion.json",
      pointers: "exemplos/pointers/pointers.json",
      stringArray: "exemplos/stringArray/stringArray.json",
      scanfInput: "exemplos/scanfInput/scanfInput.json",
      structExample: "exemplos/structExample/structExample.json",
      breakContinue: "exemplos/breakContinue/breakContinue.json",
    };
    this.currentLang = "pt";
    this.langs = {
      pt: {
        title: "🔍 Simulador de Execução do Processador",
        subtitle:
          "Clique em NEXT para executar cada instrução - Veja o processador em ação!",
        chooseExample: "Escolha um exemplo:",
        codeSource: "📝 Código Fonte",
        memoryVars: "📊 Variáveis na Memória",
        processorState: "⚙️ Estado do Processador",
        instruction: "📌 Instrução:",
        processorAction: "💡 O que o processador faz:",
        programCounter: "PC (Program Counter)",
        lineLabel: "Linha",
        ready: "⏸ PRONTO",
        waitingText: "Aguardando início...",
        running: "▶ EXECUTANDO",
        finished: "✅ FINALIZADO",
        back: "◀ VOLTAR",
        reset: "🔄 RESET",
        next: "NEXT ▶",
        programReady: "▶ Programa pronto para execução",
        pageTitle: "Simulador de Execução do Processador",
        variableLabels: {
          i: "i (contador)",
          vezes: "vezes (limite)",
          soma: "soma (acumulador)",
          x: "x (entrada)",
          y: "y (entrada)",
          resultado: "resultado (retorno)",
          n: "n (parâmetro)",
          a: "a (parâmetro)",
          b: "b (parâmetro)",
          temp: "temp (temporário)",
          max: "max (máximo)",
          arr: "arr (array)",
          category: "categoria",
          count: "count (contador)",
          option: "opção",
          result: "resultado",
          total: "total",
          value: "valor",
          ptr: "ptr (ponteiro)",
          str: "str",
          p: "p (struct)",
        },
        examples: {
          sumLoop: "Loop de Soma",
          factorial: "Fatorial",
          fibonacci: "Fibonacci",
          maxArray: "Máximo em Array",
          ifElse: "If / Else",
          whileLoop: "While",
          doWhileLoop: "Do / While",
          switchCase: "Switch",
          functions: "Funções",
          recursion: "Recursão",
          pointers: "Ponteiros",
          stringArray: "String / Char Array",
          scanfInput: "Entrada com scanf",
          structExample: "Struct",
          breakContinue: "Break / Continue",
        },
      },
      en: {
        title: "🔍 Processor Execution Simulator",
        subtitle:
          "Click NEXT to execute each instruction - See the processor in action!",
        chooseExample: "Choose an example:",
        codeSource: "📝 Source Code",
        memoryVars: "📊 Variables in Memory",
        processorState: "⚙️ Processor State",
        instruction: "📌 Instruction:",
        processorAction: "💡 What the processor does:",
        programCounter: "PC (Program Counter)",
        lineLabel: "Line",
        ready: "⏸ READY",
        waitingText: "Waiting to start...",
        running: "▶ RUNNING",
        finished: "✅ FINISHED",
        back: "◀ BACK",
        reset: "🔄 RESET",
        next: "NEXT ▶",
        programReady: "▶ Program ready for execution",
        pageTitle: "Processor Execution Simulator",
        variableLabels: {
          i: "i (counter)",
          vezes: "times (limit)",
          soma: "sum (accumulator)",
          x: "x (input)",
          y: "y (input)",
          resultado: "result (return)",
          n: "n (parameter)",
          a: "a (parameter)",
          b: "b (parameter)",
          temp: "temp (temporary)",
          max: "max (maximum)",
          arr: "arr (array)",
          category: "category",
          count: "count (counter)",
          option: "option",
          result: "result",
          total: "total",
          value: "value",
          ptr: "ptr (pointer)",
          str: "str",
          p: "person (struct)",
        },
        examples: {
          sumLoop: "Sum Loop",
          factorial: "Factorial",
          fibonacci: "Fibonacci",
          maxArray: "Maximum in Array",
          ifElse: "If / Else",
          whileLoop: "While",
          doWhileLoop: "Do / While",
          switchCase: "Switch",
          functions: "Functions",
          recursion: "Recursion",
          pointers: "Pointers",
          stringArray: "String / Char Array",
          scanfInput: "scanf Input",
          structExample: "Struct",
          breakContinue: "Break / Continue",
        },
      },
    };
    this.init();
  }

  async init() {
    await this.loadExample(this.currentExample);
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.updateLanguage();
    this.renderCode();
  }

  async loadExample(exampleKey) {
    this.currentExample = exampleKey;
    const path = this.examplesPaths[exampleKey];
    try {
      const response = await fetch(path);
      const example = await response.json();
      this.codeLines = example.codeLines;
      this.codeLinesEn = example.codeLinesEn || null;
      this.steps = example.steps;
      this.variableKeys =
        example.variableKeys || this.extractVariableKeys(example);
      this.resetSimulation();
      this.renderCode();
      this.renderVariableTable();
    } catch (error) {
      console.error("Error loading example:", error);
    }
  }

  renderCode() {
    const container = document.getElementById("codeLines");
    container.innerHTML = "";

    const codeLines =
      this.currentLang === "en" && this.codeLinesEn
        ? this.codeLinesEn
        : this.codeLines;

    codeLines.forEach((line, idx) => {
      const span = document.createElement("span");
      span.className = "line";
      span.id = `line-${idx}`;
      span.textContent = line;
      container.appendChild(span);
    });
  }

  renderVariableTable() {
    const tbody = document.getElementById("varTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    const labels = this.langs[this.currentLang].variableLabels || {};
    this.variableKeys.forEach((key) => {
      const row = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.id = `label_var_${key}`;
      labelCell.textContent = labels[key] || key;
      const valueCell = document.createElement("td");
      valueCell.id = `var_${key}`;
      valueCell.textContent = "-";
      row.appendChild(labelCell);
      row.appendChild(valueCell);
      tbody.appendChild(row);
    });
  }

  extractVariableKeys(example) {
    const keys = new Set();
    (example.steps || []).forEach((step) => {
      if (step.vars) {
        Object.keys(step.vars).forEach((key) => keys.add(key));
      }
    });
    return Array.from(keys);
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === "pt" ? "en" : "pt";
    this.updateLanguage();
    this.renderCode();
    this.resetSimulation();
  }

  updateLanguage() {
    const lang = this.langs[this.currentLang];
    document.title = lang.pageTitle;
    document.documentElement.lang = this.currentLang === "pt" ? "pt-BR" : "en";
    document.querySelector(".header h1").textContent = lang.title;
    document.querySelector(".subtitle").textContent = lang.subtitle;
    document.querySelector("label[for='exampleSelect']").textContent =
      lang.chooseExample;
    document.querySelector(".code-panel h2").textContent = lang.codeSource;
    document.querySelector(".variables-panel h2").textContent = lang.memoryVars;
    document.querySelector(".info-panel h3").textContent = lang.processorState;
    document.getElementById("prevBtn").textContent = lang.back;
    document.getElementById("resetBtn").textContent = lang.reset;
    document.getElementById("nextBtn").textContent = lang.next;
    document.getElementById("langBtn").textContent =
      this.currentLang === "pt" ? "EN" : "PT";

    // Update select options
    const select = document.getElementById("exampleSelect");
    for (let option of select.options) {
      option.textContent = lang.examples[option.value];
    }

    // Update variable labels
    const vars = lang.variableLabels || {};
    Object.entries(vars).forEach(([key, labelText]) => {
      const labelElem = document.getElementById(`label_var_${key}`);
      if (labelElem) {
        labelElem.textContent = labelText;
      }
    });
  }

  updateCodeHighlight() {
    // Limpa todos os destaques
    document.querySelectorAll(".line").forEach((line) => {
      line.classList.remove("current", "executed");
    });

    // Marca linhas já executadas
    for (let i = 0; i <= this.currentStep; i++) {
      const stepLine = this.steps[i].line;
      const lineElem = document.getElementById(`line-${stepLine}`);
      if (lineElem) {
        if (
          i < this.currentStep ||
          this.currentStep === this.steps.length - 1
        ) {
          lineElem.classList.add("executed");
        }
      }
    }

    // Marca linha atual apenas se não for o último step
    if (this.currentStep >= 0 && this.currentStep < this.steps.length - 1) {
      const currentLine = this.steps[this.currentStep].line;
      const currentElem = document.getElementById(`line-${currentLine}`);
      if (currentElem) {
        currentElem.classList.add("current");
        // Scroll para a linha atual dentro do painel
        currentElem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }

  updateVariables(stepVars) {
    // Clear all variable value cells first.
    document.querySelectorAll("td[id^='var_']").forEach((elem) => {
      if (!elem.id.startsWith("label_var_")) {
        elem.textContent = "-";
      }
    });

    // Update with current values
    for (const [key, value] of Object.entries(stepVars)) {
      const elem = document.getElementById(`var_${key}`);
      if (elem) {
        elem.textContent = value !== undefined && value !== null ? value : "-";
      }
    }
  }

  addOutput(text) {
    if (text) {
      this.outputs.push(text);
      const outputArea = document.getElementById("outputArea");
      const outputDiv = document.createElement("div");
      outputDiv.className = "output-line";
      outputDiv.textContent = `▶ ${text}`;
      outputArea.appendChild(outputDiv);
      outputArea.scrollTop = outputArea.scrollHeight;
    }
  }

  updateUI() {
    if (this.currentStep >= 0 && this.currentStep < this.steps.length) {
      const step = this.steps[this.currentStep];
      const actionText =
        this.currentLang === "en" ? step.actionEn || step.action : step.action;
      const descText =
        this.currentLang === "en" ? step.descEn || step.desc : step.desc;

      // Atualiza descrição
      document.getElementById("stepInfo").innerHTML = `
                <strong>${this.langs[this.currentLang].instruction}</strong> ${actionText}<br>
                <strong>${this.langs[this.currentLang].processorAction}</strong> ${descText}
            `;

      // Atualiza PC
      document.getElementById("pcInfo").innerHTML =
        `${this.langs[this.currentLang].programCounter}: ${this.currentStep + 1} / ${this.steps.length} | ${this.langs[this.currentLang].lineLabel}: ${step.line + 1}`;

      // Atualiza variáveis
      this.updateVariables(step.vars);

      // Adiciona output se houver
      if (step.output) {
        const outputText =
          this.currentLang === "en"
            ? step.outputEn || step.output
            : step.output;
        this.addOutput(outputText);
      }

      // Atualiza status
      const statusElem = document.getElementById("status");
      if (this.currentStep === this.steps.length - 1) {
        statusElem.className = "status finished";
        statusElem.innerHTML = this.langs[this.currentLang].finished;
        document.getElementById("nextBtn").disabled = true;
      } else {
        statusElem.className = "status running";
        statusElem.innerHTML = this.langs[this.currentLang].running;
        document.getElementById("nextBtn").disabled = false;
      }

      // Atualiza botão voltar
      document.getElementById("prevBtn").disabled = this.currentStep === 0;
    }

    this.updateCodeHighlight();
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      // Salva no histórico
      if (this.currentStep >= 0) {
        this.history.push(this.currentStep);
      }

      this.currentStep++;
      this.updateUI();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      // Remove último output se necessário
      if (this.steps[this.currentStep + 1]?.output) {
        this.outputs.pop();
        const outputArea = document.getElementById("outputArea");
        if (outputArea.lastChild) {
          outputArea.removeChild(outputArea.lastChild);
        }
      }
      this.updateUI();
    }
  }

  resetSimulation() {
    this.currentStep = -1;
    this.history = [];
    this.outputs = [];

    // Limpa output
    const outputArea = document.getElementById("outputArea");
    outputArea.innerHTML = `<div class="output-line">${this.langs[this.currentLang].programReady}</div>`;

    // Reseta variáveis
    this.updateVariables({});

    // Reseta UI
    document.getElementById("stepInfo").innerHTML =
      this.langs[this.currentLang].waitingText;
    document.getElementById("pcInfo").innerHTML =
      `${this.langs[this.currentLang].programCounter}: 0 | ${this.langs[this.currentLang].lineLabel}: 0`;
    document.getElementById("status").className = "status waiting";
    document.getElementById("status").innerHTML =
      this.langs[this.currentLang].ready;
    document.getElementById("nextBtn").disabled = false;
    document.getElementById("prevBtn").disabled = true;

    // Limpa destaques
    document.querySelectorAll(".line").forEach((line) => {
      line.classList.remove("current", "executed");
    });
  }

  setupEventListeners() {
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextStep());
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.prevStep());
    document
      .getElementById("resetBtn")
      .addEventListener("click", () => this.resetSimulation());
    document
      .getElementById("exampleSelect")
      .addEventListener("change", (e) => this.loadExample(e.target.value));
    document
      .getElementById("langBtn")
      .addEventListener("click", () => this.toggleLanguage());
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.prevStep();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        this.resetSimulation();
      }
    });
  }
}

// Initialize the simulator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const simulator = new Simulator();
});
