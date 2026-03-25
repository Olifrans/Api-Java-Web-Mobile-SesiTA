let editId = null;

document.addEventListener("DOMContentLoaded", carregar);


function carregar() {

    fetch("http://localhost:8080/alunos")
        .then(r => r.json())
        .then(data => {

            const tbody = document.getElementById("aluno-tbody");

            tbody.innerHTML = "";

            data.forEach(a => {

                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${a.nome}</td>
                    <td>${a.email}</td>
                    <td>${a.telefone}</td>

                    <td>

                        <button class="btn btn-edit"
                        onclick="editar(${a.id},
                        \`${a.nome}\`,
                        \`${a.email}\`,
                        \`${a.telefone}\`)">

                        Editar
                        </button>

                        <button class="btn btn-delete"
                        onclick="excluir(${a.id})">

                        Excluir
                        </button>

                    </td>
                `;

                tbody.appendChild(tr);

            });

        });
}



function abrirModal() {

    editId = null;

    modal.style.display = "flex";

    limpar();
}



function fecharModal() {

    modal.style.display = "none";

}



function limpar() {

    nome.value = "";
    email.value = "";
    telefone.value = "";
}



function salvar() {

    const aluno = {

        nome: nome.value,
        email: email.value,
        telefone: telefone.value

    };

    if (editId == null) {

        fetch("http://localhost:8080/alunos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aluno)
        })
        .then(() => {
            fecharModal();
            carregar();
        });

    } else {

        fetch(`http://localhost:8080/alunos/${editId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(aluno)
        })
        .then(() => {
            fecharModal();
            carregar();
        });

    }

}



function excluir(id) {

    if (!confirm("Excluir aluno?")) return;

    fetch(`http://localhost:8080/alunos/${id}`, {
        method: "DELETE"
    })
    .then(() => carregar());

}



function editar(id,n,e,t) {

    editId = id;

    nome.value = n;
    email.value = e;
    telefone.value = t;

    modal.style.display = "flex";

}