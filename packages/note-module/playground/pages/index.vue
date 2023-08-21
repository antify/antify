<template>
  <div class='h-screen bg-gray-50 p-2 box-border flex space-x-2'>
    <AntNoteModuleNoteWidget
      title='Notes from multiconnection'
      provider='tenant'
      tenant-id='note-module'
    />
    <AntNoteModuleNoteWidget
      title='Notes from singleconnection'
      provider='core'
    />
  </div>
</template>
