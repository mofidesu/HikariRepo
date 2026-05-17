$inputFile = "c:\Users\ilker\HikariRepo\products.csv"
$outputFile = "c:\Users\ilker\HikariRepo\products_updated.csv"

Write-Host "Reading CSV..."
$data = Import-Csv -Path $inputFile -Delimiter ";" -Encoding UTF8

Write-Host "Processing $($data.Count) rows..."

$updatedCount = 0

foreach ($row in $data) {
    $mainCat = $row.'Ana Kategori'
    $subCat = $row.'Alt Kategori'
    
    if ([string]::IsNullOrWhiteSpace($mainCat) -or $mainCat -eq "N/A" -or $mainCat -eq "NA" -or [string]::IsNullOrWhiteSpace($subCat) -or $subCat -eq "N/A" -or $subCat -eq "NA") {
        
        $title = if ($row.'Ürün Adı') { $row.'Ürün Adı'.ToLower() } else { "" }
        $brand = if ($row.'Marka') { $row.'Marka'.ToLower() } else { "" }
        $combinedText = "$title $brand"
        
        $matched = $false
        
        if ($combinedText -match "telefon|kılıf|şarj|kablo|powerbank|kulaklık|ekran koruyucu|bluetooth|airpods") {
            $row.'Ana Kategori' = "Elektronik"; $row.'Alt Kategori' = "Telefon & Aksesuar"; $matched = $true
        } elseif ($combinedText -match "bilgisayar|laptop|tablet|mouse|klavye|monitör|yazıcı|ssd|usb|modem|pil|batarya|oyuncu") {
            $row.'Ana Kategori' = "Elektronik"; $row.'Alt Kategori' = "Bilgisayar & Tablet"; $matched = $true
        } elseif ($combinedText -match "buzdolabı|çamaşır makinesi|bulaşık makinesi|klima|fırın|derin dondurucu") {
            $row.'Ana Kategori' = "Elektronik"; $row.'Alt Kategori' = "Beyaz Eşya"; $matched = $true
        } elseif ($combinedText -match "süpürge|ütü|blender|tost makinesi|kahve makinesi|çay makinesi|rondo|mikser|epilatör|saç kurutma|maşa|düzleştirici") {
            $row.'Ana Kategori' = "Elektronik"; $row.'Alt Kategori' = "Elektrikli Ev Aletleri"; $matched = $true
        } elseif ($combinedText -match "televizyon|tv|projeksiyon") {
            $row.'Ana Kategori' = "Elektronik"; $row.'Alt Kategori' = "TV & Görüntü"; $matched = $true
        } elseif ($combinedText -match "akıllı saat|bileklik") {
            $row.'Ana Kategori' = "Elektronik"; $row.'Alt Kategori' = "Giyilebilir Teknoloji"; $matched = $true
        } elseif ($combinedText -match "çikolata|kahve|çay|bisküvi|yağ|salça|makarna|pirinç|bal|fındık|ceviz|kuruyemiş|lokum|şeker") {
            $row.'Ana Kategori' = "Süpermarket"; $row.'Alt Kategori' = "Gıda"; $matched = $true
        } elseif ($combinedText -match "su|meyve suyu|kola|gazoz|enerji içeceği") {
            $row.'Ana Kategori' = "Süpermarket"; $row.'Alt Kategori' = "İçecek"; $matched = $true
        } elseif ($combinedText -match "deterjan|yumuşatıcı|sabun|temizleyici|çamaşır suyu|peçete|tuvalet kağıdı|kağıt havlu|bulaşık deterjanı|yüzey temizleyici") {
            $row.'Ana Kategori' = "Süpermarket"; $row.'Alt Kategori' = "Ev Bakım & Temizlik"; $matched = $true
        } elseif ($combinedText -match "kedi|köpek|mama|kum|tasma|ödül|kuş yemi") {
            $row.'Ana Kategori' = "Süpermarket"; $row.'Alt Kategori' = "Pet Shop"; $matched = $true
        } elseif ($combinedText -match "kalem|defter|kağıt|rulo|pos|kutu|bant|silgi|dosya|ajanda|fotokopi kağıdı") {
            $row.'Ana Kategori' = "Süpermarket"; $row.'Alt Kategori' = "Kırtasiye & Ofis"; $matched = $true
        } elseif ($combinedText -match "ruj|fondöten|maskara|far|göz kalemi|allık|pudra|kapatıcı|eyeliner|oje|makyaj|dipliner|aydınlatıcı|highlighter") {
            $row.'Ana Kategori' = "Kozmetik"; $row.'Alt Kategori' = "Makyaj"; $matched = $true
        } elseif ($combinedText -match "krem|serum|maske|nemlendirici|tonik|losyon|güneş kremi|peeling|yüz yıkama|anti-aging|göz kremi") {
            $row.'Ana Kategori' = "Kozmetik"; $row.'Alt Kategori' = "Cilt Bakımı"; $matched = $true
        } elseif ($combinedText -match "şampuan|saç kremi|saç boyası|tarak|jöle|saç spreyi|saç bakım|wax") {
            $row.'Ana Kategori' = "Kozmetik"; $row.'Alt Kategori' = "Saç Bakımı"; $matched = $true
        } elseif ($combinedText -match "parfüm|deodorant|roll-on|vücut spreyi|edt|edp") {
            $row.'Ana Kategori' = "Kozmetik"; $row.'Alt Kategori' = "Parfüm & Deodorant"; $matched = $true
        } elseif ($combinedText -match "diş macunu|diş fırçası|ağız çalkalama|diş ipi") {
            $row.'Ana Kategori' = "Kozmetik"; $row.'Alt Kategori' = "Ağız Bakım"; $matched = $true
        } elseif ($combinedText -match "tıraş|sakal|jilet|after shave|tıraş makinesi|tıraş köpüğü") {
            $row.'Ana Kategori' = "Kozmetik"; $row.'Alt Kategori' = "Erkek Bakım"; $matched = $true
        } elseif ($combinedText -match "erkek ayakkabı|erkek spor ayakkabı|erkek bot|erkek terlik|erkek sneaker|kundura|erkek çizme") {
            $row.'Ana Kategori' = "Ayakkabı & Çanta"; $row.'Alt Kategori' = "Erkek Ayakkabı"; $matched = $true
        } elseif ($combinedText -match "kadın ayakkabı|topuklu|babet|kadın bot|kadın terlik|kadın sneaker|sandalet|kadın çizme|ayakkabı|sneaker|çizme|bot") {
            $row.'Ana Kategori' = "Ayakkabı & Çanta"; $row.'Alt Kategori' = "Kadın Ayakkabı"; $matched = $true
        } elseif ($combinedText -match "kadın çanta|omuz çantası|sırt çantası|cüzdan|çapraz çanta") {
            $row.'Ana Kategori' = "Ayakkabı & Çanta"; $row.'Alt Kategori' = "Kadın Çanta"; $matched = $true
        } elseif ($combinedText -match "erkek çanta|erkek sırt çantası|erkek cüzdan|evrak çantası") {
            $row.'Ana Kategori' = "Ayakkabı & Çanta"; $row.'Alt Kategori' = "Erkek Çanta"; $matched = $true
        } elseif ($combinedText -match "valiz|bavul|seyahat çantası") {
            $row.'Ana Kategori' = "Ayakkabı & Çanta"; $row.'Alt Kategori' = "Valiz & Seyahat"; $matched = $true
        } elseif ($combinedText -match "tabak|bardak|tencere|tava|çatal|kaşık|bıçak|kase|fincan|tepsi|saklama kabı|termos|süzgeç") {
            $row.'Ana Kategori' = "Ev & Mobilya"; $row.'Alt Kategori' = "Sofra & Mutfak"; $matched = $true
        } elseif ($combinedText -match "nevresim|yorgan|yastık|havlu|battaniye|çarşaf|pike|perde|halı|kilim|paspas|hurç") {
            $row.'Ana Kategori' = "Ev & Mobilya"; $row.'Alt Kategori' = "Ev Tekstili"; $matched = $true
        } elseif ($combinedText -match "tablo|vazo|mum|çerçeve|biblo|duvar saati|tütsü|mumluk|ayna") {
            $row.'Ana Kategori' = "Ev & Mobilya"; $row.'Alt Kategori' = "Ev Dekorasyon"; $matched = $true
        } elseif ($combinedText -match "koltuk|masa|sandalye|dolap|şifonyer|kitaplık|sehpa|karyola|puf|yatak") {
            $row.'Ana Kategori' = "Ev & Mobilya"; $row.'Alt Kategori' = "Mobilya"; $matched = $true
        } elseif ($combinedText -match "avize|lamba|ampul|abajur|led|lambader|aplik") {
            $row.'Ana Kategori' = "Ev & Mobilya"; $row.'Alt Kategori' = "Aydınlatma"; $matched = $true
        } elseif ($combinedText -match "matkap|tornavida|çekiç|priz|kablo|anahtar seti|vida|boya|bant") {
            $row.'Ana Kategori' = "Ev & Mobilya"; $row.'Alt Kategori' = "Yapı Market"; $matched = $true
        } elseif ($combinedText -match "bebek takımı|zıbın|bebek tulum|bebek battaniyesi|hastane çıkışı") {
            $row.'Ana Kategori' = "Anne & Çocuk"; $row.'Alt Kategori' = "Bebek Giyim"; $matched = $true
        } elseif ($combinedText -match "erkek çocuk") {
            $row.'Ana Kategori' = "Anne & Çocuk"; $row.'Alt Kategori' = "Erkek Çocuk Giyim"; $matched = $true
        } elseif ($combinedText -match "kız çocuk") {
            $row.'Ana Kategori' = "Anne & Çocuk"; $row.'Alt Kategori' = "Kız Çocuk Giyim"; $matched = $true
        } elseif ($combinedText -match "bebek bezi|ıslak mendil|pişik kremi|emzik|biberon|göğüs pompası|bebek şampuanı|bebek arabası|oto koltuğu") {
            $row.'Ana Kategori' = "Anne & Çocuk"; $row.'Alt Kategori' = "Bebek Bakım"; $matched = $true
        } elseif ($combinedText -match "oyuncak|lego|puzzle|araba|bebek|peluş|kutu oyunu|yapboz|figür|akülü araba") {
            $row.'Ana Kategori' = "Anne & Çocuk"; $row.'Alt Kategori' = "Oyuncak"; $matched = $true
        } elseif ($combinedText -match "kolye|küpe|yüzük|bileklik|altın|gümüş|broş|tesbih|çelik kolye|zincir") {
            $row.'Ana Kategori' = "Saat & Aksesuar"; $row.'Alt Kategori' = "Takı & Mücevher"; $matched = $true
        } elseif ($combinedText -match "kadın saat") {
            $row.'Ana Kategori' = "Saat & Aksesuar"; $row.'Alt Kategori' = "Kadın Saat"; $matched = $true
        } elseif ($combinedText -match "erkek saat") {
            $row.'Ana Kategori' = "Saat & Aksesuar"; $row.'Alt Kategori' = "Erkek Saat"; $matched = $true
        } elseif ($combinedText -match "şapka|bere|kasket|kep") {
            $row.'Ana Kategori' = "Saat & Aksesuar"; $row.'Alt Kategori' = "Şapka & Bere"; $matched = $true
        } elseif ($combinedText -match "şal|eşarp|atkı|fular") {
            $row.'Ana Kategori' = "Saat & Aksesuar"; $row.'Alt Kategori' = "Şal & Eşarp"; $matched = $true
        } elseif ($combinedText -match "gözlük|güneş gözlüğü") {
            $row.'Ana Kategori' = "Saat & Aksesuar"; $row.'Alt Kategori' = "Güneş Gözlüğü"; $matched = $true
        } elseif ($combinedText -match "eşofman|spor tayt|spor sütyeni|forma|spor şort") {
            $row.'Ana Kategori' = "Spor & Outdoor"; $row.'Alt Kategori' = "Spor Giyim"; $matched = $true
        } elseif ($combinedText -match "çadır|uyku tulumu|matara|kamp|fener|termos") {
            $row.'Ana Kategori' = "Spor & Outdoor"; $row.'Alt Kategori' = "Kamp & Doğa"; $matched = $true
        } elseif ($combinedText -match "dambıl|pilates|koşu bandı|direnç lastiği|kumbara") {
            $row.'Ana Kategori' = "Spor & Outdoor"; $row.'Alt Kategori' = "Kondisyon & Fitness"; $matched = $true
        } elseif ($combinedText -match "futbol topu|basketbol topu|voleybol|tenis|bisiklet|kaykay|paten") {
            $row.'Ana Kategori' = "Spor & Outdoor"; $row.'Alt Kategori' = "Spor Ekipmanları"; $matched = $true
        } elseif ($combinedText -match "boxer|erkek külot|erkek atlet|erkek çorap|erkek pijama") {
            $row.'Ana Kategori' = "Erkek"; $row.'Alt Kategori' = "İç Giyim"; $matched = $true
        } elseif ($combinedText -match "erkek tişört|erkek pantolon|erkek gömlek|erkek mont|erkek ceket|erkek kaban|erkek kazak|erkek şort|erkek sweatshirt|t-shirt|erkek yelek|erkek hırka") {
            $row.'Ana Kategori' = "Erkek"; $row.'Alt Kategori' = "Giyim"; $matched = $true
        } elseif ($combinedText -match "sütyen|kadın külot|kadın atlet|pijama|gecelik|kadın çorap|korse|jartiyer|badi") {
            $row.'Ana Kategori' = "Kadın"; $row.'Alt Kategori' = "İç Giyim"; $matched = $true
        } elseif ($combinedText -match "elbise|kadın tişört|kadın pantolon|kadın gömlek|kadın mont|kadın ceket|kadın kaban|kazak|şort|etek|bluz|tunik|kadın sweatshirt|tayt|tulum|kadın yelek|kadın hırka|pantolon|gömlek|tişört|ceket|kaban|sweatshirt|hırka|yelek") {
            $row.'Ana Kategori' = "Kadın"; $row.'Alt Kategori' = "Giyim"; $matched = $true
        } else {
            $row.'Ana Kategori' = "Süpermarket"
            $row.'Alt Kategori' = "Diğer"
        }
        
        $updatedCount++
    }
}

Write-Host "Updated categories for $updatedCount products."
Write-Host "Saving CSV..."

$data | Export-Csv -Path $outputFile -Delimiter ";" -Encoding UTF8 -NoTypeInformation

Remove-Item $inputFile -Force
Rename-Item $outputFile "products.csv"

Write-Host "Categorization Done!"
