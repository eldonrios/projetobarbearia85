
const dataInput = document.getElementById('data');
const listaHorarios = document.getElementById('listaHorarios');
const btnLimparAgendamentos = document.getElementById('btnLimparAgendamentos');
const numeroWhats = "5511989358783";

const hoje = new Date().toISOString().split("T")[0];
dataInput.min = hoje;

function getAgendamentos() {
  return JSON.parse(localStorage.getItem('horariosAgendados')) || [];
}

function setAgendamentos(lista) {
  localStorage.setItem('horariosAgendados', JSON.stringify(lista));
}

function mostrarHorariosDisponiveis() {
  const agendados = getAgendamentos();
  const dataSelecionada = dataInput.value;
  listaHorarios.innerHTML = '';

  if (!dataSelecionada) {
    listaHorarios.textContent = 'Por favor, selecione uma data.';
    return;
  }

  for (let hora = 8; hora <= 21; hora++) {
    const horarioStr = hora.toString().padStart(2, '0') + ':00';
    const jaAgendado = agendados.some(a => a.data === dataSelecionada && a.horario === horarioStr);

    const btnHora = document.createElement('button');
    btnHora.textContent = horarioStr;
    btnHora.className = 'horario';

    if (jaAgendado) {
      btnHora.disabled = true;
      btnHora.classList.add('indisponivel');
      btnHora.title = 'Horário já agendado';
    } else {
      btnHora.title = 'Clique para agendar este horário';
      btnHora.addEventListener('click', () => {
        agendarHorario(dataSelecionada, horarioStr);
      });
    }

    listaHorarios.appendChild(btnHora);
  }
}

function agendarHorario(data, horario) {
  const agendados = getAgendamentos();
  if (agendados.some(a => a.data === data && a.horario === horario)) {
    alert('Este horário já está agendado!');
    return;
  }

  agendados.push({ data, horario });
  setAgendamentos(agendados);

  const dataFormatada = new Date(data).toLocaleDateString('pt-BR');
  const mensagem = `Olá, Barbearia do João! Gostaria de agendar um horário para o dia ${dataFormatada} às ${horario}.`;

  window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`, '_blank');
  mostrarHorariosDisponiveis();
}

btnLimparAgendamentos.addEventListener('click', () => {
  if (confirm('Tem certeza que deseja limpar todos os agendamentos?')) {
    localStorage.removeItem('horariosAgendados');
    alert('Todos os agendamentos foram apagados.');
    mostrarHorariosDisponiveis();
  }
});

dataInput.addEventListener('change', mostrarHorariosDisponiveis);

window.addEventListener('load', () => {
  if (dataInput.value) {
    mostrarHorariosDisponiveis();
  }
});
