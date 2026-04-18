class Simulator {
  constructor() {
    this.currentExample = "sumLoop";
    this.currentStep = -1;
    this.history = [];
    this.outputs = [];
    this.init();
  }

  init() {
    this.loadExample(this.currentExample);
    this.setupEventListeners();
    this.setupKeyboardShortcuts();
  }

  loadExample(exampleKey) {
    this.currentExample = exampleKey;
    const example = examples[exampleKey];
    this.codeLines = example.codeLines;
    this.steps = example.steps;
    this.resetSimulation();
    this.renderCode();
  }

  renderCode() {
    const container = document.getElementById("codeLines");
    container.innerHTML = "";

    this.codeLines.forEach((line, idx) => {
      const span = document.createElement("span");
      span.className = "line";
      span.id = `line-${idx}`;
      span.textContent = line;
      container.appendChild(span);
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
      if (lineElem && i < this.currentStep) {
        lineElem.classList.add("executed");
      }
    }

    // Marca linha atual
    if (this.currentStep >= 0 && this.currentStep < this.steps.length) {
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

      // Atualiza descrição
      document.getElementById("stepInfo").innerHTML = `
                <strong>📌 Instrução:</strong> ${step.action}<br>
                <strong>💡 O que o processador faz:</strong> ${step.desc}
            `;

      // Atualiza PC
      document.getElementById("pcInfo").innerHTML =
        `PC (Program Counter): ${this.currentStep + 1} / ${this.steps.length} | Linha: ${step.line + 1}`;

      // Atualiza variáveis
      this.updateVariables(step.vars);

      // Adiciona output se houver
      if (step.output) {
        this.addOutput(step.output);
      }

      // Atualiza status
      const statusElem = document.getElementById("status");
      if (this.currentStep === this.steps.length - 1) {
        statusElem.className = "status finished";
        statusElem.innerHTML = "✅ FINALIZADO";
        document.getElementById("nextBtn").disabled = true;
      } else {
        statusElem.className = "status running";
        statusElem.innerHTML = "▶ EXECUTANDO";
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
    outputArea.innerHTML =
      '<div class="output-line">▶ Programa pronto para execução</div>';

    // Reseta variáveis
    this.updateVariables({});

    // Reseta UI
    document.getElementById("stepInfo").innerHTML = "Aguardando início...";
    document.getElementById("pcInfo").innerHTML = "PC (Program Counter): 0";
    document.getElementById("status").className = "status waiting";
    document.getElementById("status").innerHTML = "⏸ PRONTO";
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
