// "Async boundary": o entry só faz um import dinâmico.
// Isso dá ao Module Federation a chance de negociar as dependências
// compartilhadas (React etc.) ANTES de qualquer código do app rodar.
// Sem isso você vê o erro clássico "Shared module is not available for eager consumption".
import('./bootstrap');
