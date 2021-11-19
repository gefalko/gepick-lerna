import JSZip from 'jszip'

export async function zipWeb(name: string, files: File[]) {
  const zip = new JSZip()
  const folder = zip.folder(name)

  if (folder && files[0]) {
    folder.file(files[0].name, files[0])

    const zippedContent = await zip.generateAsync({ type: 'blob' })

    return zippedContent
  }

  return null
}
