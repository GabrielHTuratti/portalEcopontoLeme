const map = L.map('map').setView([-22.160717, -47.372813], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
L.marker([-22.160717, -47.372813])
    .addTo(map)
    .bindPopup('<b>Ecoponto Ribeirão do Meio</b><br>Final da Av. Sete de Setembro')
    .openPopup();

const Denuncias = {
    adicionar(d) {
    const lista = JSON.parse(localStorage.getItem('denuncias') || '[]');
    lista.unshift({ ...d, data: new Date().toLocaleString('pt-BR') });
    localStorage.setItem('denuncias', JSON.stringify(lista));
    },
    listar() { return JSON.parse(localStorage.getItem('denuncias') || '[]'); }
};

const fotoInput = document.getElementById('fotoInput');
const preview = document.getElementById('preview');
const btnEnviar = document.getElementById('btnEnviar');
const lista = document.getElementById('listaDenuncias');

fotoInput.addEventListener('change', () => {
    const file = fotoInput.files[0];
    if (file) {
    const reader = new FileReader();
    reader.onload = e => preview.innerHTML = `<img src="${e.target.result}" class="foto-preview">`;
    reader.readAsDataURL(file);
    }
});

btnEnviar.onclick = () => {
    const bairro = document.getElementById('bairro').value.trim();
    const rua = document.getElementById('rua').value.trim();
    const tipo = document.getElementById('tipo').value;
    const desc = document.getElementById('descricao').value.trim();
    const temFoto = fotoInput.files[0];

    const palavras = desc.split(/\s+/).filter(word => word.length > 0);
    const totalPalavras = palavras.length;

    if (!bairro || !rua || !tipo || desc === '') {
        toast('Preencha todos os campos!', 'error');
        return;
    }

    if (totalPalavras < 10) {
        toast(`Faltam detalhes! Só ${totalPalavras} palavra(s). Mínimo: 10`, 'warn');
        return;
    }

    if (temFoto) {
    const reader = new FileReader();
    reader.onload = e => salvarDenuncia({ bairro, rua, tipo, descricao: desc, foto: e.target.result });
    reader.readAsDataURL(temFoto);
    } else {
    salvarDenuncia({ bairro, rua, tipo, descricao: desc, foto: null });
    }

    const texto = `*DENÚNCIA LEME*%0A*Bairro:* ${bairro}%0A*Rua:* ${rua}%0A*Tipo:* ${tipo}%0A*Descrição:* ${desc}`;
    window.open(`https://wa.me/551930971000?text=${texto}`, '_blank');

    toast('Denúncia enviada com sucesso!', 'success');

    document.getElementById('formDenuncia').reset();
    preview.innerHTML = '';
};

function toast(msg, tipo = 'success') {
  const div = document.createElement('div');
  div.className = `toast ${tipo}`;
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}

function atualizar() {
    const denuncias = Denuncias.listar();
    lista.innerHTML = denuncias.length === 0
    ? '<p style="text-align:center; color:#666;">Nenhuma denúncia ainda. Seja o primeiro!</p>'
    : denuncias.map(d => `
        <div style="background:#f0f8f0; padding:15px; margin:10px 0; border-radius:8px;">
        <strong>${d.bairro} - ${d.rua}</strong> <small>(${d.data})</small><br>
        <em>${d.tipo}:</em> ${d.descricao}
        ${d.foto ? `<br><img src="${d.foto}" class="foto-preview">` : ''}
        </div>`).join('');
}
function salvarDenuncia(d) {
  const arr = JSON.parse(localStorage.getItem('denuncias') || '[]');
  arr.unshift({ ...d, data: new Date().toLocaleString('pt-BR') });
  localStorage.setItem('denuncias', JSON.stringify(arr));
  atualizar();
}

atualizar();