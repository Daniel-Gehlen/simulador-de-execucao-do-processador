class Simulator {
  constructor() {
    this.currentExample = "sumLoop";
    this.currentStep = -1;
    this.history = [];
    this.outputs = [];
    this.examplesPaths = {
      sumLoop: "exemplos/sumLoop/sumLoop.json",
      factorial: "exemplos/factorial/factorial.json",
      fibonacci: "exemplos/fibonacci/fibonacci.json",
      maxArray: "exemplos/maxArray/maxArray.json",
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
          resultado: "resultado (retorno)",
          n: "n (parâmetro)",
          a: "a (fibonacci)",
          b: "b (fibonacci)",
          temp: "temp (temporário)",
          max: "max (máximo)",
          arr: "arr (array)",
        },
        examples: {
          sumLoop: "Loop de Soma",
          factorial: "Fatorial",
          fibonacci: "Fibonacci",
          maxArray: "Máximo em Array",
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
          vezes: "vezes (limit)",
          soma: "soma (accumulator)",
          x: "x (input)",
          resultado: "resultado (return)",
          n: "n (parameter)",
          a: "a (fibonacci)",
          b: "b (fibonacci)",
          temp: "temp (temporary)",
          max: "max (maximum)",
          arr: "arr (array)",
        },
        examples: {
          sumLoop: "Sum Loop",
          factorial: "Factorial",
          fibonacci: "Fibonacci",
          maxArray: "Maximum in Array",
        },
      },
    };
    this.init();
  }

  init() {
    this.loadExample(this.currentExample);
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
    this.updateLanguage();
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
      this.resetSimulation();
      this.renderCode();
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
    // Clear all variables first
    document.getElementById("var_i").textContent = "-";
    document.getElementById("var_vezes").textContent = "-";
    document.getElementById("var_soma").textContent = "-";
    document.getElementById("var_x").textContent = "-";
    document.getElementById("var_resultado").textContent = "-";
    document.getElementById("var_n").textContent = "-";
    document.getElementById("var_a").textContent = "-";
    document.getElementById("var_b").textContent = "-";
    document.getElementById("var_temp").textContent = "-";

    // Update with current values
    for (const [key, value] of Object.entries(stepVars)) {
      const elem = document.getElementById(`var_${key}`);
      if (elem) {
        elem.textContent = value !== undefined ? value : "-";
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
