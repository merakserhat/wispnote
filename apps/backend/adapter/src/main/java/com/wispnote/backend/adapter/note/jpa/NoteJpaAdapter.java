package com.wispnote.backend.adapter.note.jpa;

import com.wispnote.backend.adapter.common.exception.EntityNotFoundException;
import com.wispnote.backend.adapter.note.converter.EnrichmentStatusConverter;
import com.wispnote.backend.adapter.note.converter.NoteKindConverter;
import com.wispnote.backend.adapter.note.jpa.entity.NoteEntity;
import com.wispnote.backend.adapter.note.jpa.entity.TagEntity;
import com.wispnote.backend.adapter.note.jpa.repository.NoteRepository;
import com.wispnote.backend.adapter.note.jpa.repository.TagRepository;
import com.wispnote.backend.adapter.note.jpa.specification.NoteSpecification;
import com.wispnote.backend.adapter.common.util.PaginationUtil;
import com.wispnote.backend.application.common.model.Paginated;
import com.wispnote.backend.application.common.model.PaginationInfo;
import com.wispnote.backend.application.note.model.Note;
import com.wispnote.backend.application.note.model.NoteFilter;
import com.wispnote.backend.application.note.port.NotePort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static java.util.stream.Collectors.toSet;
import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
@RequiredArgsConstructor
public class NoteJpaAdapter implements NotePort {

    private final NoteRepository noteRepository;
    private final TagRepository tagRepository;

    @Override
    public Note create(Note note) {
        var entity = new NoteEntity();
        entity.setMemberId(note.memberId());
        entity.setSourceId(note.sourceId());
        entity.setKind(NoteKindConverter.jpa.fromEnum(note.kind()));
        entity.setSelectedText(note.selectedText());
        entity.setUserNote(note.userNote());
        entity.setContextBefore(note.contextBefore());
        entity.setContextAfter(note.contextAfter());
        entity.setSection(note.section());
        entity.setPageNumber(note.pageNumber());
        entity.setLocation(note.location());
        entity.setWindowTitle(note.windowTitle());
        entity.setEnrichmentStatus(EnrichmentStatusConverter.jpa.fromEnum(note.enrichmentStatus()));
        entity.setRawCapture(note.rawCapture());
        entity.setTags(resolveTags(note.tags()));

        return noteRepository.save(entity).toModel();
    }

    @Override
    public Optional<Note> findByIdAndMemberId(UUID id, UUID memberId) {
        return noteRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                .map(NoteEntity::toModel);
    }

    @Override
    public boolean existsByIdAndMemberId(UUID id, UUID memberId) {
        return noteRepository.existsByIdAndMemberId(id, memberId);
    }

    @Override
    public Paginated<Note> findAllByMemberId(UUID memberId, NoteFilter filter, PaginationInfo paginationInfo) {
        var page = noteRepository.findAll(
                NoteSpecification.of(memberId, filter),
                PaginationUtil.fromPaginationInfo(paginationInfo));

        return PaginationUtil.fromPage(page.map(NoteEntity::toModel));
    }

    @Override
    public void deleteByIdAndMemberId(UUID id, UUID memberId) {
            log.info("Deleting note by {}, {}", kv("id", id), kv("memberId", memberId));
            var note = noteRepository.findByIdAndMemberIdAndDeletedFalse(id, memberId)
                            .orElseThrow(EntityNotFoundException::new);
            note.setDeleted(true);
            noteRepository.save(note);
    }

    /**
     * Turns tag names into rows, creating the ones that don't exist yet. Two members tagging
     * with the same new name concurrently will race and {@code uq_tag_name} rejects one —
     * retry the request rather than locking the table.
     */
    private Set<TagEntity> resolveTags(Set<String> names) {
        if (names == null || names.isEmpty()) {
            return new HashSet<>();
        }

        var wanted = names.stream()
                .filter(name -> name != null && !name.isBlank())
                .map(String::trim)
                .collect(toSet());

        var resolved = new HashSet<>(tagRepository.findByNameInAndDeletedFalse(wanted));
        var existing = resolved.stream().map(TagEntity::getName).collect(toSet());

        wanted.stream()
                .filter(name -> !existing.contains(name))
                .forEach(name -> {
                    var tag = new TagEntity();
                    tag.setName(name);
                    resolved.add(tagRepository.save(tag));
                });

        return resolved;
    }
}
