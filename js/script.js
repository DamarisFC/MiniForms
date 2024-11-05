class Cadastro {
    constructor() {
        this.cadastros = []; // Array para armazenar os cadastros localmente
        this.editIndex = null; // Índice do cadastro em edição

        // Elementos do DOM
        this.nomeInput = document.getElementById("nome");
        this.emailInput = document.getElementById("email");
        this.cadastroList = document.getElementById("cadastroList");
        this.addButton = document.getElementById("addButton");
        this.updateButton = document.getElementById("updateButton");

        // Eventos
        document.getElementById("cadastroForm").addEventListener("submit", (e) => this.addCadastro(e));
        this.updateButton.addEventListener("click", () => this.updateCadastro());

        // Carrega os dados iniciais do servidor
        this.fetchCadastros();
    }

    // Método para buscar todos os cadastros do servidor
    async fetchCadastros() {
        try {
            const response = await fetch('/api/cadastros');
            this.cadastros = await response.json();
            this.renderList();
        } catch (error) {
            console.error("Erro ao buscar cadastros:", error);
        }
    }

    // Método para adicionar um novo cadastro no servidor
    async addCadastro(event) {
        event.preventDefault();

        const nome = this.nomeInput.value;
        const email = this.emailInput.value;

        if (this.editIndex === null) {
            // Novo cadastro
            try {
                const response = await fetch('/api/cadastros', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome, email }),
                });
                const novoCadastro = await response.json();
                this.cadastros.push(novoCadastro); // Adiciona o novo cadastro ao array local
            } catch (error) {
                console.error("Erro ao adicionar cadastro:", error);
            }
        } else {
            // Atualizar cadastro existente
            const id = this.cadastros[this.editIndex].id;
            try {
                const response = await fetch(`/api/cadastros/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome, email }),
                });
                const cadastroAtualizado = await response.json();
                this.cadastros[this.editIndex] = cadastroAtualizado; // Atualiza o cadastro no array local
                this.editIndex = null;
                this.addButton.style.display = "block";
                this.updateButton.style.display = "none";
            } catch (error) {
                console.error("Erro ao atualizar cadastro:", error);
            }
        }

        // Limpa o formulário e atualiza a lista
        this.clearForm();
        this.renderList();
    }

    // Método para editar um cadastro (preenche o formulário com dados para edição)
    editCadastro(index) {
        const cadastro = this.cadastros[index];
        this.nomeInput.value = cadastro.nome;
        this.emailInput.value = cadastro.email;

        this.editIndex = index;
        this.addButton.style.display = "none";
        this.updateButton.style.display = "block";
    }

    // Método para excluir um cadastro no servidor
    async deleteCadastro(index) {
        const id = this.cadastros[index].id;
        try {
            await fetch(`/api/cadastros/${id}`, { method: 'DELETE' });
            this.cadastros.splice(index, 1); // Remove o cadastro do array local
            this.renderList();
        } catch (error) {
            console.error("Erro ao excluir cadastro:", error);
        }
    }

    // Renderiza a lista de cadastros no DOM
    renderList() {
        this.cadastroList.innerHTML = "";
        this.cadastros.forEach((cadastro, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${cadastro.nome} - ${cadastro.email}</span>
                <div>
                    <button onclick="app.editCadastro(${index})">Editar</button>
                    <button onclick="app.deleteCadastro(${index})">Excluir</button>
                </div>
            `;
            this.cadastroList.appendChild(li);
        });
    }

    // Limpa o formulário
    clearForm() {
        this.nomeInput.value = "";
        this.emailInput.value = "";
    }
}

// Inicializa a classe ao carregar a página
const app = new Cadastro();
