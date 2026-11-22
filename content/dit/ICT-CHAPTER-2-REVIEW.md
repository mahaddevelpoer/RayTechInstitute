# ICT Chapter 2 System Unit Components

Prepared as the next chapter in Mahad's approved DIT publishing workflow, continued on 22 November 2026.

## Scope

- Official PBTE ICT syllabus sections 2.1-2.6 on page 7: motherboard; processor including CU, ALU, machine cycle, clock and comparison; bits, bytes, addressing, RAM, ROM, cache, flash and legacy CMOS memory; expansion slots, adapters and drive bays; USB, VGA, HDMI, audio, networking and FireWire; power supply.
- Six topic guides, 60 original explained MCQs, 12 solved short answers, six long answers, a functional component diagram, five practical activities and viva prompts.
- Separate practice section: 20 revision MCQs, 10 short questions, three long questions and a separate answer key. It explicitly reuses revision questions and is not advertised as an official examination pattern.
- Correct revision options are bold and shaded green; practice answers are not highlighted.
- English web guide and bundled PDF. The editable Word draft remains outside the public directory because native Word layout verification is unavailable on this runtime.

## Accuracy review

Processor frequency is distinguished from instruction throughput and workload performance. Memory addressing examples state the byte-addressable model. Binary KiB/MiB are distinguished from decimal units. CMOS technology, legacy battery-backed settings RAM and firmware storage are distinguished. USB-C shape does not establish one universal speed, video capability or charging level. M.2 is not equated universally with NVMe. PSU identification exercises exclude opening power supplies or working on live mains circuitry.

References in the guide include the PBTE outline, Intel processor guidance, NIST binary prefixes, USB-IF capability guidance, Micron memory definitions, Corsair cable compatibility and Dell CMOS/settings guidance. No past-paper board/year or guaranteed exam question is invented.

## Integration and checks

Both chapters share the existing ICT subject and retain independent chapter numbers, question IDs, note URLs and PDFs. Chapter 1's content, questions and PDF are preserved. The semester overview now reports two available ICT modules out of seven; future modules remain explicitly unpublished.

The source generator accepts a chapter number and leaves the existing Chapter 1 output files untouched when generating Chapter 2. The JSON loader used by release checks is retained. CI now explicitly runs both ICT chapter test files before building the fresh publication snapshot.

Local verification includes TypeScript, original chapter tests, new chapter coverage/answer checks, isolation/preservation checks, PDF byte/hash matching, separate practice-answer checks and semester overview rendering. Every page of the PDF is rendered and visually inspected. Full production build and post-publication verification are recorded with the release receipt.

## Verified release

Production artifact run 45003001110 passed all build, catalog, export, browser and security checks on source revision 8c7c2d8354ba03d06350f55c25da65b5bb273863. The release reuses this exact static export for Cloudflare deployment. Source integrity checks normalize line endings so Windows and Linux validate the same teaching content; Chapter 1's public text, MCQs and PDF remain unchanged.

Artifact run: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/45003001110

Cloudflare deployment run 45003431148 succeeded. Custom-domain verification on 22 November 2026 confirmed six public pages return HTTP 200, the Chapter 2 guide is present in the sitemap, page headings/canonical/indexing directives are valid, and deployment metadata matches the tested artifact source revision. The live Chapter 2 PDF exactly matches the reviewed 67,812-byte file; the existing Chapter 1 PDF hash remains unchanged. The component SVG also returns HTTP 200. Evidence: ICT-CHAPTER-2-LIVE-VERIFICATION.json.

Deployment run: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/45003431148
