import { db } from "@/lib/db"
import { addGalleryImage, deleteGalleryImage } from "@/lib/actions"
import Image from "next/image"
import { Trash2 } from "lucide-react"

export default async function AdminGalleryPage() {
  const images = await db.galleryImage.findMany({ orderBy: { sortOrder: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Galéria kezelése ({images.length} kép)</h2>
      </div>

      {/* Upload form */}
      <form action={addGalleryImage} className="bg-[#0a1f0a] border border-[#d4a017]/10 p-6">
        <h3 className="text-white font-medium mb-4">Új kép hozzáadása</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kép URL</label>
            <input type="text" name="url" required placeholder="/images/foto.jpg vagy https://..." className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Leírás</label>
            <input type="text" name="alt" placeholder="Kép rövid leírása" className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[#d4a017] focus:outline-none transition-colors text-sm" />
          </div>
          <div>
            <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">Kategória</label>
            <select name="category" className="w-full h-10 px-3 bg-white/5 border border-white/10 text-white focus:border-[#d4a017] focus:outline-none transition-colors text-sm">
              <option value="general">Általános</option>
              <option value="training">Edzés</option>
              <option value="match">Mérkőzés</option>
              <option value="team">Csapat</option>
              <option value="event">Esemény</option>
            </select>
          </div>
        </div>
        <button type="submit" className="mt-4 px-6 h-10 bg-[#d4a017] text-[#0a1f0a] text-sm font-semibold hover:bg-[#d4a017]/90 transition-colors">
          Kép hozzáadása
        </button>
      </form>

      {/* Gallery grid */}
      {images.length === 0 ? (
        <div className="text-center py-20 text-white/30">Még nincs kép a galériában</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden bg-[#0a1f0a] border border-[#d4a017]/10">
              <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end">
                <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-white text-xs truncate mb-2">{img.alt || "Nincs leírás"}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#d4a017] text-xs">{img.category}</span>
                    <form action={async () => { "use server"; await deleteGalleryImage(img.id) }}>
                      <button type="submit" className="w-7 h-7 flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
