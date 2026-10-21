# Арт Винсента

`assets/vincent.png` — иллюстрация с прозрачным фоном. Получена встроенным инструментом генерации изображений (не CLI) 18 октября 2026 года по фотографии-референсу пользователя и одобренному эскизу трёх поз. Исходный пользовательский файл не включён в публичную сборку.

Финальный промпт:

> Use case illustration-story. Create one production-ready transparent PNG mascot asset for a children's literature game. Input images are CHARACTER IDENTITY and watercolor style references. ONE single adorable apricot toy poodle Vincent, exactly recognizable from references: fine warm golden apricot curls, long soft floppy ears, dark round brown eyes, little black nose, same oversized black artist beret. Full body sitting three-quarter view with face turned toward viewer, gently lifting one front paw in a friendly greeting, natural dog anatomy. A small closed burgundy storybook rests beside him at floor level. Painterly fine watercolor children's book illustration, rich natural textures but clean outer silhouette, simplified enough to read at 250px. Preserve identity, black beret and curl details. Centered subject fills 85 percent canvas, entire paws ears tail beret and book visible, no cropping. Truly transparent background, no paper rectangle, no frames, no museum, no lettering, no watermark, no additional animals. Only one poodle. Warm engaging expression for ages 6-10.

В первой версии движение сделано средствами интерфейса на основе этой позы. Отдельные кадры чтения, моргания и движения лап пока не созданы.


## Подарочные образы 0.2
`assets/vincent-scarf.png` и `assets/vincent-professor.png` сгенерированы встроенным инструментом ImageGen по исходному прозрачному `assets/vincent.png`. Фон прозрачный. Общая часть промпта:

> Use case: illustration-story. Asset type: one transparent production mascot for the children's literature web game. The attached image is the strict CHARACTER IDENTITY, full-body pose, composition, watercolor technique and scale reference. Depict exactly this same apricot toy poodle Vincent, matching face, dark brown eyes, golden curly fur, floppy ears, his same tilted black beret, sitting in the same greeting pose with one front paw raised, the same closed burgundy book at his side. Change ONLY the requested wearable outfit. Keep all body parts, proportions, face identity, pose and framing as close as possible. Watercolor children's book art with detailed curls, natural dog anatomy. One dog centered, full body plus book entirely visible. Truly transparent background and clean silhouette, no paper rectangle, no frames, no text, no extra characters.

Дополнение для шарфа:

> OUTFIT: a soft deep red wool scarf wrapped once gently around his neck with two short scarf ends hanging onto his upper chest, elegant cozy winter reading accessory. Preserve original black beret. No other clothing.

Дополнение для очков и бабочки:

> OUTFIT: thin round dark bronze spectacles perched naturally in front of his eyes and a small sage-green bow tie at his neck. Glasses do not hide his expressive eyes. Preserve original black beret. No other clothing.

Мячик `assets/ball.svg` и косточка `assets/bone.svg` — собственные векторные элементы интерфейса, сочетающиеся с существующими условными иллюстрациями.


## Коллекция 0.5.0 · 20 октября 2026

24 файла `assets/rewards/*.svg` — собственная векторная графика в палитре игры, включая отдельные накладные аксессуары в `wardrobe.js`. Эмодзи не используются вместо арта. Четыре полных прозрачных образа `vincent-hoodie.png`, `vincent-capybara.png`, `vincent-dragon.png`, `vincent-keeper.png` получены встроенным ImageGen по `assets/vincent.png`. Прозрачность и внешность Винсента сохранены; финальные промпты ниже.

# Vincent wardrobe outfit generation

Mode: built-in image_gen; identity-preserve edits. All four assets use transparent_background=true. Reference: outputs/vincent-books/assets/vincent.png (existing Vincent mascot provided by project). AI-generated production variants, no third-party visual assets inserted. Generated 2026-10-20.

## vincent-hoodie.png

ImageGen source ID: exec-9517ed24-4040-4219-b9bd-0edf19117d32.png

Final prompt:

Use case: identity-preserve.
Asset type: transparent watercolor mascot outfit for a children's reading web game.
Input image 1 is the edit target and exact character reference. Change only the clothing into a cozy oversized sage green hoodie with warm orange lining and a small paw emblem on the chest. Keep hood down so the black beret and ears remain visible.
Preserve the exact same friendly apricot toy poodle Vincent: same expressive brown eyes, smiling muzzle and pink tongue, long curly apricot ears, seated greeting pose with right paw raised, tail curling left, red closed book lower right, proportions, scale, centered square framing and delicate hand painted watercolor style. The full dog, paws, tail and book must fit inside the canvas. Same placement and silhouette as far as clothing allows.
Output a single mascot cutout, genuinely transparent alpha background. No scenery, floor, shadow disc, border, letters, watermark, extra props or extra characters. Keep crisp naturally painted watercolor edges; no checkerboard painted into the art.

## vincent-capybara.png

ImageGen source ID: exec-fd0e15fa-7b4b-464d-b142-465001c2c254.png

Final prompt:

Use case: identity-preserve.
Asset type: transparent watercolor mascot outfit for a children's reading web game.
Input image 1 is the edit target and exact character reference. Change only the clothing into a cozy caramel capybara kigurumi onesie with round capybara ears and little sleepy capybara face on its hood. The hood can replace the black beret, but the apricot poodle's face and long curly ears remain unmistakably visible.
Preserve the exact same friendly apricot toy poodle Vincent: same expressive brown eyes, smiling muzzle and pink tongue, long curly apricot ears, seated greeting pose with right paw raised, tail curling left, red closed book lower right, proportions, scale, centered square framing and delicate hand painted watercolor style. The full dog, paws, tail and book must fit inside the canvas. Same placement and silhouette as far as clothing allows.
Output a single mascot cutout, genuinely transparent alpha background. No scenery, floor, shadow disc, border, letters, watermark, extra props or extra characters. Keep crisp naturally painted watercolor edges; no checkerboard painted into the art.

## vincent-dragon.png

ImageGen source ID: exec-cb976403-9431-4378-ba46-9351ca9d9fdd.png

Final prompt:

Use case: identity-preserve.
Asset type: transparent watercolor mascot outfit for a children's reading web game.
Input image 1 is the edit target and exact character reference. Change only the clothing into a teal and sage dragon costume with two small decorative wings and rounded soft dorsal spikes. Keep the black beret visible, and the poodle's face and long curly ears unchanged.
Preserve the exact same friendly apricot toy poodle Vincent: same expressive brown eyes, smiling muzzle and pink tongue, long curly apricot ears, seated greeting pose with right paw raised, tail curling left, red closed book lower right, proportions, scale, centered square framing and delicate hand painted watercolor style. The full dog, paws, tail and book must fit inside the canvas. Same placement and silhouette as far as clothing allows.
Output a single mascot cutout, genuinely transparent alpha background. No scenery, floor, shadow disc, border, letters, watermark, extra props or extra characters. Keep crisp naturally painted watercolor edges; no checkerboard painted into the art.

## vincent-keeper.png

ImageGen source ID: exec-dc599d0c-641b-4770-88ee-5838ee3b9b27.png

Final prompt:

Use case: identity-preserve.
Asset type: transparent watercolor mascot outfit for a children's reading web game.
Input image 1 is the edit target and exact character reference. Change only the clothing into a magnificent storykeeper outfit: an elegant golden crown worn in place of the beret, midnight teal cape with tiny gold star and book embroidery, soft regal collar. No lettering.
Preserve the exact same friendly apricot toy poodle Vincent: same expressive brown eyes, smiling muzzle and pink tongue, long curly apricot ears, seated greeting pose with right paw raised, tail curling left, red closed book lower right, proportions, scale, centered square framing and delicate hand painted watercolor style. The full dog, paws, tail and book must fit inside the canvas. Same placement and silhouette as far as clothing allows.
Output a single mascot cutout, genuinely transparent alpha background. No scenery, floor, shadow disc, border, letters, watermark, extra props or extra characters. Keep crisp naturally painted watercolor edges; no checkerboard painted into the art.




## Акварельная коллекция 0.5.1

Плоские наградные SVG в интерфейсе заменены акварельным артом, соответствующим Винсенту. 22 новых оригинала созданы встроенным ImageGen; четыре готовых полных образа повторно использованы в карточках наград. Прежние мячик и косточка тоже перерисованы. Перечень финальных файлов, точные промпты и способ веб-оптимизации — [WATERCOLOR-ART.md](WATERCOLOR-ART.md).

## Звуки · 0.5.2

Восемь коротких эффектов из [Pixabay Sound Effects](https://pixabay.com/sound-effects/) по [лицензии Pixabay](https://pixabay.com/service/license-summary/): бесплатно, без обязательной атрибуции. Файлы обрезаны (тишина в начале, 0,5–2,6 с), приведены к моно 96 kbps, плавно затухают и выровнены по громкости до −22…−28 LUFS, чтобы не перекрикивать ребёнка и класс.

| Файл в `assets/sounds/` | Когда звучит | Исходник |
| --- | --- | --- |
| `correct.mp3` | верная пара, полка, найденное название, верный ответ | [UI Success Chime](https://pixabay.com/sound-effects/technology-ui-success-chime-513565/) |
| `wrong.mp3` | ошибка в паре, полке или вопросе | [Soft UI Warning Alert](https://pixabay.com/sound-effects/film-special-effects-soft-ui-warning-alert-1-614153/) |
| `coin.mp3` | заработана монетка (кроме последнего вопроса раунда) | [Coin](https://pixabay.com/sound-effects/film-special-effects-coin-257878/) |
| `round-complete.mp3` | раунд пройден с подсказками | [Marimba Win B 3](https://pixabay.com/sound-effects/musical-marimba-win-b-3-209679/) |
| `grand-finale.mp3` | раунд без единой подсказки, «Хранитель историй» | [Harp Flourish](https://pixabay.com/sound-effects/musical-harp-flourish-6251/) |
| `purchase.mp3` | покупка в магазине Винсента | [Magical Notification Tone](https://pixabay.com/sound-effects/film-special-effects-magical-notification-tone-soft-fantasy-digital-alert-438278/) |
| `page.mp3` | открытие карточки или текста истории | [Page Turn](https://pixabay.com/sound-effects/film-special-effects-page-turn-305789/) |
| `tap.mp3` | нажатие на игрушку | [Pop](https://pixabay.com/sound-effects/film-special-effects-pop-402324/) |

`sounds.js` загружает файлы через Web Audio. Если файл не загрузился, для верного и неверного ответа звучит прежний синтезированный аккорд. Громкость каждого эффекта задаётся в `volume` внутри `sounds.js`.
