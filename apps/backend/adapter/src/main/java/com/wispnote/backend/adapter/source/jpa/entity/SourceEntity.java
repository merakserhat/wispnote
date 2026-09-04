package com.wispnote.backend.adapter.source.jpa.entity;

import com.wispnote.backend.adapter.common.jpa.entity.BaseEntity;
import com.wispnote.backend.adapter.source.converter.SourceKindConverter;
import com.wispnote.backend.application.source.model.Source;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "source")
public class SourceEntity extends BaseEntity {

    @Column(nullable = false)
    private UUID memberId;

    @Column(nullable = false)
    private String kind;

    @Column(name = "key", nullable = false)
    private String key;

    @Column(nullable = false)
    private String title = "";

    private String url;

    private String filePath;

    private String appName;

    private String bundleId;

    private String externalId;

    private Integer pageCount;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(nullable = false)
    private Map<String, Object> metadata = new HashMap<>();

    public Source toModel() {
        return new Source(getId(),
                memberId,
                SourceKindConverter.jpa.toEnum(kind),
                key,
                title,
                url,
                filePath,
                appName,
                bundleId,
                externalId,
                pageCount,
                metadata);
    }
}
