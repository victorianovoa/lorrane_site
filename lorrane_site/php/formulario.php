<?php
/**
 * formulario.php
 * Back-end do formulário de contato — Lorrane Félix Personal Trainer
 * Recebe dados via POST (fetch/AJAX), valida, sanitiza e envia e-mail.
 * Retorna JSON para o front-end tratar a resposta.
 */

// ── Permite requisições do front-end (CORS para desenvolvimento local) ──
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// ── Só aceita POST ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'erro', 'mensagem' => 'Método não permitido.']);
    exit;
}

// ── Recebe e sanitiza os campos ─────────────────────────────────────────
$nome     = htmlspecialchars(trim($_POST['nome']     ?? ''), ENT_QUOTES, 'UTF-8');
$email    = htmlspecialchars(trim($_POST['email']    ?? ''), ENT_QUOTES, 'UTF-8');
$telefone = htmlspecialchars(trim($_POST['telefone'] ?? ''), ENT_QUOTES, 'UTF-8');
$objetivo = htmlspecialchars(trim($_POST['objetivo'] ?? ''), ENT_QUOTES, 'UTF-8');
$mensagem = htmlspecialchars(trim($_POST['mensagem'] ?? ''), ENT_QUOTES, 'UTF-8');

// ── Validação server-side ───────────────────────────────────────────────
$erros = [];

if (empty($nome)) {
    $erros[] = 'O campo Nome é obrigatório.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros[] = 'Informe um e-mail válido.';
}

if (empty($objetivo)) {
    $erros[] = 'Selecione um objetivo.';
}

if (empty($mensagem)) {
    $erros[] = 'O campo Mensagem é obrigatório.';
}

// ── Retorna erros se houver ─────────────────────────────────────────────
if (!empty($erros)) {
    http_response_code(422);
    echo json_encode([
        'status'  => 'erro',
        'erros'   => $erros
    ]);
    exit;
}

// ── Monta e envia o e-mail ──────────────────────────────────────────────
$para    = 'personallorrane@gmail.com'; // ← ALTERE para o e-mail real da Lorrane
$assunto = "Novo contato pelo site – $nome";

$corpo  = "Você recebeu uma nova mensagem pelo site.\n\n";
$corpo .= "-------------------------------------------\n";
$corpo .= "Nome:      $nome\n";
$corpo .= "E-mail:    $email\n";
$corpo .= "Telefone:  " . ($telefone ?: 'Não informado') . "\n";
$corpo .= "Objetivo:  $objetivo\n";
$corpo .= "-------------------------------------------\n\n";
$corpo .= "Mensagem:\n$mensagem\n";

$headers  = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($para, $assunto, $corpo, $headers)) {
    http_response_code(200);
    echo json_encode([
        'status'    => 'sucesso',
        'mensagem'  => "Obrigada, $nome! Sua mensagem foi enviada. Retorno em breve! 🌿"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status'   => 'erro',
        'mensagem' => 'Houve um problema ao enviar. Tente novamente ou use o WhatsApp.'
    ]);
}
?>
