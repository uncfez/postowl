<script>
  import EditorToolbar from '$lib/components/EditorToolbar.svelte';
  import { fetchJSON, isEmailValid } from '$lib/util';
  import { goto } from '$app/navigation';
  import PlainText from '$lib/components/PlainText.svelte';

  export let data;
  let editable, name, email;

  $: currentUser = data.currentUser;
  $: bio = data.bio;
  $: {
    // HACK: To make sure this is only run when the parent passes in new data
    data = data;
    initOrReset();
  }

  function initOrReset() {
    name = data.name;
    email = data.email;
    editable = true;
  }

  async function deleteFriend() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    if (confirm('Vill du verkligen radera? Det går inte att ångra.')) {
      try {
        await fetchJSON('POST', '/api/delete-friend', {
          friend_id: data.friend_id
        });
        goto('/friends');
      } catch (err) {
        console.error(err);
        alert('Något gick fel. Försök igen.');
      }
    }
  }

  async function saveFriend() {
    if (!currentUser) return alert('Sorry, you are not authorized.');
    try {
      await fetchJSON('POST', '/api/update-friend', {
        friend_id: data.friend_id,
        name,
        email
      });
      goto('/friends');
    } catch (err) {
      console.error(err);
      alert(
        "Det gick inte att spara. Se till att e-postadressen inte redan används."
      );
    }
  }
</script>

<svelte:head>
  <title>{name || email}</title>
  <link rel="icon" type="image/png" sizes="300x300" href={bio.avatar} />
  <link rel="apple-touch-icon" sizes="300x300" href={bio.avatar} />
</svelte:head>

{#if editable}
  <EditorToolbar
    on:cancel={() => goto('/friends')}
    on:save={saveFriend}
    canConfirm={isEmailValid(email)}
  />
{/if}

<div class="max-w-screen-md mx-auto px-6 pb-8 sm:text-xl">
  <div class="pt-24 text-sm font-bold">Name</div>
  <div class="border-b py-2">
    <PlainText {editable} bind:content={name} placeholder="Skriv namn" />
  </div>

  <div class="pt-8 text-sm font-bold">E-post</div>
  <div class="border-b py-2">
    <PlainText {editable} bind:content={email} placeholder="Skriv e-postadress" />
  </div>

  <div class="text-center pt-12">
    <button
      class="font-medium text-sm sm:text-base rounded-full w-full py-3 border border-rose-600 text-rose-600"
      on:click={deleteFriend}>Radera vän</button
    >
  </div>
</div>
